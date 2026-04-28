![image-20250621124138454](https://7r1umph.top/image/20250621124138743.webp)

```
<pre> magic_num_list = [12, 43, 36, 47, 21, 40, 23, 42, 14, 54, 10, 53, 14, 36, 32, 40, 28, 50, 22, 40] Hint: Use python code for decoding the magic_num_list... </pre>
```

下载

```
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ unzip 47.zip 
Archive:  47.zip
  inflating: 47.py                   
                                                                                                                                                                                   
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ cat 47.       
cat: 47.: No such file or directory
                                                                                                                                                                                   
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ cat 47.py 
import string

def magic_encode(flag):
    flag, magic_num_list = divmod(flag, 61)
    return f"{string.digits[1:] + string.ascii_uppercase + string.ascii_lowercase}" [magic_num_list]                                                                                               
```

61 进制映射

```
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ cat 47p.py 
import string

base61_table = string.digits[1:] + string.ascii_uppercase + string.ascii_lowercase
magic_num_list = [12, 43, 36, 47, 21, 40, 23, 42, 14, 54, 10, 53, 14, 36, 32, 40, 28, 50, 22, 40]

decoded = ''.join(base61_table[i] for i in magic_num_list)
print(decoded)

┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ python3 $_
DibmMfOhFtBsFbXfTpNf
  
```

但是我拿去交，错的

那就有一种可能了，编码表的顺序可能有问题

我们直接爆破

```
┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ cat 47p.py
import string

magic_num_list = [12, 43, 36, 47, 21, 40, 23, 42, 14, 54, 10, 53, 14, 36, 32, 40, 28, 50, 22, 40]

tables = {
    'digits[1:] + uppercase + lowercase': string.digits[1:] + string.ascii_uppercase + string.ascii_lowercase,
    'digits + lowercase + uppercase': string.digits + string.ascii_lowercase + string.ascii_uppercase,
    'digits + uppercase + lowercase': string.digits + string.ascii_uppercase + string.ascii_lowercase,
    'uppercase + lowercase + digits': string.ascii_uppercase + string.ascii_lowercase + string.digits,
}

for name, table in tables.items():
    try:
        decoded = ''.join(table[i] for i in magic_num_list)
        print(f"{name} --> {decoded}")
    except IndexError:
        print(f"{name} --> IndexError: 表长度不足")

┌──(kali㉿kali)-[/mnt/hgfs/gx]
└─$ python3 $_
digits[1:] + uppercase + lowercase --> DibmMfOhFtBsFbXfTpNf
digits + lowercase + uppercase --> cHALlEnGeSaReAwEsOmE
digits + uppercase + lowercase --> ChalLeNgEsArEaWeSoMe
uppercase + lowercase + digits --> MrkvVoXqO2K1OkgocyWo
                                                 
```

一个个试

这个是对的cHALlEnGeSaReAwEsOmE

```
HMV{cHALlEnGeSaReAwEsOmE}
```

