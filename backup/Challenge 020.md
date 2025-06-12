![image-20250612183946052](https://raw.githubusercontent.com/7r1UMPH/7r1UMPH.github.io/main/static/image/202506121839359.webp)

```
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ curl http://momo.hackmyvm.eu/li0nsg3l9vhhe/                        
You are not coming from https://nepcodex.com/                                         
```

伪造`Referer` 请求头

```
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ curl -e https://nepcodex.com/ http://momo.hackmyvm.eu/li0nsg3l9vhhe/
HMV{youareawelcome}                                                                  
```

