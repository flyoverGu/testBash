#! /bin/sh

start() {
    echo "*****开始启动node服务"
    pm2 start pm2.json
    echo "*****启动完成"
}

installDevCentos() {
    echo "安装依赖"
    wget http://people.centos.org/tru/devtools-2/devtools-2.repo -O /etc/yum.repos.d/devtools-2.repo
    yum install devtoolset-2-gcc devtoolset-2-binutils devtoolset-2-gcc-c++
    scl enable devtoolset-2 bash
    env CC=/opt/rh/devtoolset-2/root/usr/bin/gcc CXX=/opt/rh/devtoolset-2/root/usr/bin/g++
    echo "安装依赖完成"
}

installDevMac() {
    echo "安装依赖"
    brew install pkg-config cairo libpng jpeg giflib
    echo "安装依赖完成"
}

install() {
    echo "选择系统?"
    echo "-> 1. centos"
    echo "-> 2. mac"
    read -p "选择一个数字1, 2? (默认是1)  " osNum
    [ -z "$osNum" ] && osNum=1

    if [ "$osNum" == '1' ];then
        installDevCentos
    else
        installDevMac
    fi
    
    echo "*****开始安装node module"
    sudo npm install
    echo "*****完成安装node module"
    start
}


restart() {
    echo "*****开始重启node服务"
    pm2 kill 
    pm2 start pm2.json
    echo "*****重启完成"
}

stop() {
    echo "*****开始关闭node服务"
    pm2 kill
    echo "*****关闭完成"
}

echo "你想干什么?"
echo "-> 1. 安装环境并启动服务"
echo "-> 2. 重启服务"
echo "-> 3. 关闭服务"
read -p "选择一个数字1, 2, 3? (默认是1)  " selectNum 
[ -z "$selectNum" ] && selectNum=1

if [ "$selectNum" == '1' ];then
    install
elif [ "$selectNum" == '2' ];then
    restart
else 
    stop
fi
