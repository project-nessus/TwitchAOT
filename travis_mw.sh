#!/bin/sh

echo "Install Mono and Wine.."
sudo dpkg --add-architecture i386
sudo apt-get install -y gnupg ca-certificates unzip
wget -qO - https://dl.winehq.org/wine-builds/winehq.key | sudo apt-key add -
sudo apt-add-repository 'deb https://dl.winehq.org/wine-builds/ubuntu/ bionic main'
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 3FA7E0328081BFF6A14DA29AA6A19B38D3D831EF
echo "deb https://download.mono-project.com/repo/ubuntu stable-bionic main" | sudo tee /etc/apt/sources.list.d/mono-official-stable.list
sudo apt update -q
sudo apt-get install -y --install-recommends winehq-stable
sudo apt install -y mono-devel
