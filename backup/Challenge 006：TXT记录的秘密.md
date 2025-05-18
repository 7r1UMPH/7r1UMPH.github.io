# 挑战信息

### 挑战信息

*   **挑战名称/编号:** Challenge 006
*   **挑战链接:** [https://hackmyvm.eu/challenges/challenge.php?c=006](https://hackmyvm.eu/challenges/challenge.php?c=006)

### 初始观察

![image-20250518100536187](https://7r1UMPH.top/image/20250518100536383.webp)

我们得到了像 `"hackmyvm.eu. 100 IN TXT"` 这样的提示，那目标就非常明确了——直奔 `hackmyvm.eu` 的 TXT 记录去！

## 探索过程

有了这么明确的指向，咱们就用 `dig` 命令来一探究竟。

### 1.常规A记录查询

虽然目标直指TXT记录，但养成好习惯，先看看A记录总没错，了解一下域名指向的IP。

```bash
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ dig hackmyvm.eu 

; <<>> DiG 9.20.8-6-Debian <<>> hackmyvm.eu
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 62911
;; flags: qr rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 1

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; MBZ: 0x0005, udp: 1232
;; QUESTION SECTION:
;hackmyvm.eu.                   IN      A

;; ANSWER SECTION:
hackmyvm.eu.            5       IN      A       188.68.49.239

;; Query time: 60 msec
;; SERVER: 192.168.205.2#53(192.168.205.2) (UDP)
;; WHEN: Sat May 17 22:05:57 EDT 2025
;; MSG SIZE  rcvd: 56
```

嗯，`hackmyvm.eu` 指向 `188.68.49.239`。信息get，但对这个特定挑战来说，不是重点。

### 2. 查询TXT记录

现在，根据我们的“情报”（或者说常规思路），直接查询 `hackmyvm.eu` 的 TXT 记录。

```bash
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ dig txt hackmyvm.eu

; <<>> DiG 9.20.8-6-Debian <<>> txt hackmyvm.eu
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 12739
;; flags: qr rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 1

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; MBZ: 0x0005, udp: 1232
;; QUESTION SECTION:
;hackmyvm.eu.                   IN      TXT

;; ANSWER SECTION:
hackmyvm.eu.            5       IN      TXT     "hmv{sasviyalin}"

;; Query time: 388 msec
;; SERVER: 192.168.205.2#53(192.168.205.2) (UDP)
;; WHEN: Sat May 17 22:06:25 EDT 2025
;; MSG SIZE  rcvd: 68
```

Bingo! 看到 `ANSWER SECTION` 了吗？
`hackmyvm.eu.            5       IN      TXT     "hmv{sasviyalin}"`
这不就是咱们寻找的 Flag 嘛！

## Flag

毫无疑问，Flag 就是：

`hmv{sasviyalin}`

标签: hackmyvm靶场
