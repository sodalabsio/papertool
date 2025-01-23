# On Amazon Linux 2:
mkdir -p wkhtmltopdf-layer/bin
mkdir -p wkhtmltopdf-layer/lib
mkdir -p wkhtmltopdf-layer/etc/fonts
mkdir -p wkhtmltopdf-layer/usr/share/fonts/minimal

# Download and install UPX manually
wget https://github.com/upx/upx/releases/download/v4.1.0/upx-4.1.0-amd64_linux.tar.xz
tar -xf upx-4.1.0-amd64_linux.tar.xz
UPX_BIN="./upx-4.1.0-amd64_linux/upx"

# Install wkhtmltopdf and minimal dependencies
sudo yum -y install libXext \
                    libXrender \
                    fontconfig \
                    freetype \
                    libjpeg-turbo \
                    libpng \
                    libX11 \
                    libXau \
                    libxcb

# Install wkhtmltopdf
wget https://github.com/wkhtmltopdf/packaging/releases/download/0.12.6-1/wkhtmltox-0.12.6-1.amazonlinux2.x86_64.rpm
sudo rpm -ivh wkhtmltox-0.12.6-1.amazonlinux2.x86_64.rpm

# Copy and compress binary
cp /usr/local/bin/wkhtmltopdf wkhtmltopdf-layer/bin/
$UPX_BIN --best wkhtmltopdf-layer/bin/wkhtmltopdf

# Function to copy a library, strip debug symbols, and handle symlinks
copy_lib() {
    local lib="$1"
    local dest_dir="$2"
    
    if [[ -L "$lib" ]]; then
        # Get the target of the symlink
        local target=$(readlink -f "$lib")
        # Copy and strip the target
        cp "$target" "$dest_dir/$(basename $target)"
        strip --strip-unneeded "$dest_dir/$(basename $target)"
        # Create the symlink
        ln -sf $(basename "$target") "$dest_dir/$(basename $lib)"
    else
        # Copy and strip the library
        cp "$lib" "$dest_dir/"
        strip --strip-unneeded "$dest_dir/$(basename $lib)"
    fi
}

# Absolute minimum required libraries
required_libs=(
    "/usr/lib64/libjpeg.so.62"
    "/usr/lib64/libpng15.so.15"
    "/usr/lib64/libXrender.so.1"
    "/usr/lib64/libfontconfig.so.1"
    "/usr/lib64/libfreetype.so.6"
    "/usr/lib64/libXext.so.6"
    "/usr/lib64/libX11.so.6"
    "/usr/lib64/libxcb.so.1"
    "/usr/lib64/libXau.so.6"
    "/usr/local/lib/libwkhtmltox.so.0"
)

for lib in "${required_libs[@]}"; do
    copy_lib "$lib" "wkhtmltopdf-layer/lib"
done

# Download tiny font (Source Code Pro)
wget https://github.com/adobe-fonts/source-code-pro/releases/download/2.038R-ro/1.058R-it/1.058-it/OTF/SourceCodePro-Regular.otf -O wkhtmltopdf-layer/usr/share/fonts/minimal/SourceCodePro-Regular.otf

# Create minimal fonts.conf
cat > wkhtmltopdf-layer/etc/fonts/fonts.conf << 'EOL'
<?xml version="1.0"?>
<!DOCTYPE fontconfig SYSTEM "fonts.dtd">
<fontconfig>
    <dir>/usr/share/fonts/minimal</dir>
    <match target="pattern">
        <test qual="any" name="family"><string>sans-serif</string></test>
        <edit name="family" mode="assign" binding="same"><string>Source Code Pro</string></edit>
    </match>
    <cachedir>/tmp/fontconfig</cachedir>
</fontconfig>
EOL

# Set permissions
chmod 755 wkhtmltopdf-layer/bin/wkhtmltopdf
find wkhtmltopdf-layer/lib -type f -exec chmod 755 {} \;
chmod 644 wkhtmltopdf-layer/usr/share/fonts/minimal/SourceCodePro-Regular.otf
chmod 644 wkhtmltopdf-layer/etc/fonts/fonts.conf

# Print sizes before compression
echo "Sizes before compression:"
du -h wkhtmltopdf-layer/bin/wkhtmltopdf
du -h wkhtmltopdf-layer/lib/*
du -h wkhtmltopdf-layer/usr/share/fonts/minimal/*

# Create layer ZIP with maximum compression
cd wkhtmltopdf-layer
zip -9 ../wkhtmltopdf-layer.zip -r *

# Print the final size
echo "Final ZIP file size:"
ls -lh ../wkhtmltopdf-layer.zip
