#include <windows.h>
#include <propidl.h>
#include <gdiplus.h>
#include <iostream>
#include <string>
#include <vector>
#include <fstream>
#include <sstream>
#include <iomanip>

#pragma comment(lib, "gdi32.lib")
#pragma comment(lib, "gdiplus.lib")
#pragma comment(lib, "user32.lib")
#pragma comment(lib, "ole32.lib")

using namespace Gdiplus;

int GetEncoderClsid(const WCHAR* format, CLSID* pClsid) {
    UINT num = 0;
    UINT size = 0;
    GetImageEncodersSize(&num, &size);
    if (size == 0) return -1;

    ImageCodecInfo* pImageCodecInfo = (ImageCodecInfo*)(malloc(size));
    if (pImageCodecInfo == NULL) return -1;

    GetImageEncoders(num, size, pImageCodecInfo);
    for (UINT j = 0; j < num; ++j) {
        if (wcscmp(pImageCodecInfo[j].MimeType, format) == 0) {
            *pClsid = pImageCodecInfo[j].Clsid;
            free(pImageCodecInfo);
            return j;
        }
    }
    free(pImageCodecInfo);
    return -1;
}

bool CaptureDesktopScreen(const std::wstring& outputPath, const std::string& mode, int quality, int& outW, int& outH) {
    // 1. Attach to interactive desktop station
    HWINSTA hwinsta = OpenWindowStationA("winsta0", FALSE, WINSTA_ALL_ACCESS);
    if (hwinsta) {
        SetProcessWindowStation(hwinsta);
    }
    HDESK hdesk = OpenInputDesktop(0, FALSE, DESKTOP_CREATEMENU | DESKTOP_CREATEWINDOW |
                                             DESKTOP_ENUMERATE | DESKTOP_HOOKCONTROL |
                                             DESKTOP_JOURNALPLAYBACK | DESKTOP_JOURNALRECORD |
                                             DESKTOP_READOBJECTS | DESKTOP_SWITCHDESKTOP |
                                             DESKTOP_WRITEOBJECTS);
    if (hdesk) {
        SetThreadDesktop(hdesk);
    }

    // 2. Enable Per-Monitor V2 DPI awareness for true physical pixels
    HMODULE hUser32 = GetModuleHandleW(L"user32.dll");
    if (hUser32) {
        typedef BOOL(WINAPI* PFN_SetContext)(HANDLE);
        PFN_SetContext pSet = (PFN_SetContext)GetProcAddress(hUser32, "SetProcessDpiAwarenessContext");
        if (pSet) {
            pSet((HANDLE)-4); // DPI_AWARENESS_CONTEXT_PER_MONITOR_AWARE_V2
        } else {
            typedef BOOL(WINAPI* PFN_DPIAware)();
            PFN_DPIAware pAware = (PFN_DPIAware)GetProcAddress(hUser32, "SetProcessDPIAware");
            if (pAware) pAware();
        }
    }

    GdiplusStartupInput gdiplusStartupInput;
    ULONG_PTR gdiplusToken;
    GdiplusStartup(&gdiplusToken, &gdiplusStartupInput, NULL);

    int x = 0, y = 0, w = 0, h = 0;

    if (mode == "primary") {
        x = 0;
        y = 0;
        w = GetSystemMetrics(SM_CXSCREEN);
        h = GetSystemMetrics(SM_CYSCREEN);
    } else if (mode == "active") {
        HWND hwndForeground = GetForegroundWindow();
        HMONITOR hMon = NULL;
        if (hwndForeground) {
            hMon = MonitorFromWindow(hwndForeground, MONITOR_DEFAULTTOPRIMARY);
        } else {
            POINT pt = { 0, 0 };
            GetCursorPos(&pt);
            hMon = MonitorFromPoint(pt, MONITOR_DEFAULTTOPRIMARY);
        }
        MONITORINFO mi = { sizeof(MONITORINFO) };
        if (hMon && GetMonitorInfo(hMon, &mi)) {
            x = mi.rcMonitor.left;
            y = mi.rcMonitor.top;
            w = mi.rcMonitor.right - mi.rcMonitor.left;
            h = mi.rcMonitor.bottom - mi.rcMonitor.top;
        } else {
            x = 0; y = 0;
            w = GetSystemMetrics(SM_CXSCREEN);
            h = GetSystemMetrics(SM_CYSCREEN);
        }
    } else {
        // Mode "all" or default: entire virtual desktop across all connected monitors
        x = GetSystemMetrics(SM_XVIRTUALSCREEN);
        y = GetSystemMetrics(SM_YVIRTUALSCREEN);
        w = GetSystemMetrics(SM_CXVIRTUALSCREEN);
        h = GetSystemMetrics(SM_CYVIRTUALSCREEN);
        if (w <= 0 || h <= 0) {
            x = 0; y = 0;
            w = GetSystemMetrics(SM_CXSCREEN);
            h = GetSystemMetrics(SM_CYSCREEN);
        }
    }

    outW = w;
    outH = h;

    HDC hScreenDC = GetDC(NULL);
    HDC hMemoryDC = CreateCompatibleDC(hScreenDC);
    HBITMAP hBitmap = CreateCompatibleBitmap(hScreenDC, w, h);
    HBITMAP hOldBitmap = (HBITMAP)SelectObject(hMemoryDC, hBitmap);

    // SRCCOPY | CAPTUREBLT ensures layered, translucent, and OpenGL/DirectX surfaces are captured
    BitBlt(hMemoryDC, 0, 0, w, h, hScreenDC, x, y, SRCCOPY | CAPTUREBLT);

    // Overlay active mouse cursor
    CURSORINFO ci = { 0 };
    ci.cbSize = sizeof(CURSORINFO);
    if (GetCursorInfo(&ci) && ci.flags == CURSOR_SHOWING) {
        ICONINFO ii = { 0 };
        if (GetIconInfo(ci.hCursor, &ii)) {
            int cx = ci.ptScreenPos.x - ii.xHotspot - x;
            int cy = ci.ptScreenPos.y - ii.yHotspot - y;
            DrawIconEx(hMemoryDC, cx, cy, ci.hCursor, 0, 0, 0, NULL, DI_NORMAL);
            if (ii.hbmColor) DeleteObject(ii.hbmColor);
            if (ii.hbmMask) DeleteObject(ii.hbmMask);
        }
    }

    // Encode to JPEG using GDI+
    bool success = false;
    {
        Bitmap bmp(hBitmap, NULL);
        CLSID clsid;
        if (GetEncoderClsid(L"image/jpeg", &clsid) != -1) {
            EncoderParameters params;
            params.Count = 1;
            params.Parameter[0].Guid = EncoderQuality;
            params.Parameter[0].Type = EncoderParameterValueTypeLong;
            params.Parameter[0].NumberOfValues = 1;
            ULONG q = quality;
            params.Parameter[0].Value = &q;
            Status st = bmp.Save(outputPath.c_str(), &clsid, &params);
            success = (st == Ok);
        }
    }

    SelectObject(hMemoryDC, hOldBitmap);
    DeleteObject(hBitmap);
    DeleteDC(hMemoryDC);
    ReleaseDC(NULL, hScreenDC);

    if (hdesk) CloseDesktop(hdesk);
    if (hwinsta) CloseWindowStation(hwinsta);
    GdiplusShutdown(gdiplusToken);
    return success;
}

std::string GetHardwareUuid() {
    const DWORD sig = 'RSMB';
    DWORD size = GetSystemFirmwareTable(sig, 0, NULL, 0);
    if (size > 0) {
        std::vector<BYTE> buffer(size);
        if (GetSystemFirmwareTable(sig, 0, buffer.data(), size) == size) {
            BYTE* p = buffer.data();
            while (p < buffer.data() + size) {
                BYTE type = p[0];
                BYTE length = p[1];
                if (type == 1 && length >= 0x18) {
                    BYTE* uuid = p + 8;
                    std::stringstream ss;
                    ss << std::hex << std::setfill('0');
                    for (int i = 0; i < 16; i++) {
                        ss << std::setw(2) << (int)uuid[i];
                        if (i == 3 || i == 5 || i == 7 || i == 9) ss << "-";
                    }
                    std::string res = ss.str();
                    if (res != "00000000-0000-0000-0000-000000000000" && res != "ffffffff-ffff-ffff-ffff-ffffffffffff") {
                        return res;
                    }
                }
                p += length;
                while (p < buffer.data() + size - 1 && !(p[0] == 0 && p[1] == 0)) p++;
                p += 2;
            }
        }
    }
    DWORD vol = 0;
    if (GetVolumeInformationA("C:\\", NULL, 0, &vol, NULL, NULL, NULL, 0)) {
        std::stringstream ss;
        ss << "VOL-" << std::hex << std::uppercase << vol;
        return ss.str();
    }
    return "HWID-DEFAULT-NODE-X";
}

int main(int argc, char* argv[]) {
    if (argc < 2) {
        std::cout << "{\"error\":\"Missing arg\"}" << std::endl;
        return 1;
    }
    std::string cmd = argv[1];
    if (cmd == "hwid") {
        std::cout << "{\"ok\":true,\"hwid\":\"" << GetHardwareUuid() << "\"}" << std::endl;
        return 0;
    }
    if (cmd == "snapshot") {
        std::wstring outPath = L"desktop_snapshot.jpg";
        std::string mode = "all";
        int quality = 80;

        if (argc >= 3) {
            std::string p = argv[2];
            outPath = std::wstring(p.begin(), p.end());
        }
        if (argc >= 4) {
            mode = argv[3];
        }
        if (argc >= 5) {
            quality = std::stoi(argv[4]);
            if (quality < 20) quality = 20;
            if (quality > 100) quality = 100;
        }

        int w = 0, h = 0;
        bool ok = CaptureDesktopScreen(outPath, mode, quality, w, h);
        std::cout << "{\"ok\":" << (ok ? "true" : "false")
                  << ",\"width\":" << w
                  << ",\"height\":" << h
                  << ",\"mode\":\"" << mode << "\"}" << std::endl;
        return ok ? 0 : 1;
    }
    if (cmd == "check-anti-tamper") {
        bool dbg = IsDebuggerPresent();
        ULONGLONG t = GetTickCount64();
        std::cout << "{\"ok\":true,\"debuggerPresent\":" << (dbg ? "true" : "false") << ",\"uptimeMs\":" << t << "}" << std::endl;
        return 0;
    }
    std::cout << "{\"error\":\"Unknown command\"}" << std::endl;
    return 1;
}
