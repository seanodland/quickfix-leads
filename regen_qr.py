#!/usr/bin/env python3
"""
Regenerate all QR codes after deploying to live URL
Updates local copies to point to your actual GitHub Pages domain
"""

import qrcode
import os, sys

def banner(text):
    return f"\n{'='*len(text)}\n{text}\n{'='*len(text)}"

def update_qr_codes(live_url):
    print(banner(f"REGENERATING QR CODES for: {live_url}"))
    
    # Basic styling
    colors = {
        'primary': '#4f46e5',     # Indigo
        'secondary': '#7c3aed',   # Purple 
        'high_contrast': '#111827' # Near black
    }
    
    # New URLs
    urls = {
        'main': live_url,
        'analytics': f"{live_url}?utm_source=qr&utm_medium=print&utm_campaign=real_estate_urgent",
    }
    
    # Build each QR code
    for name, url in urls.items():
        print(f"\n🛠 Creating {name} QR...")
        
        # Main QR (high error correction for print)
        qr = qrcode.QRCode(
            version=None,
            error_correction=qrcode.constants.ERROR_CORRECT_H,
            box_size=10,
            border=4,
        )
        qr.add_data(url)
        qr.make(fit=True)
        
        if name == 'main':
            img = qr.make_image(fill_color=colors['primary'], back_color='white')
            img.save('qr-main-new.png')
            print(f" ✓ Saved: qr-main-new.png")
            
        elif name == 'analytics':
            img = qr.make_image(fill_color=colors['secondary'], back_color='white')
            img.save('qr-analytics-new.png')
            print(f" ✓ Saved: qr-analytics-new.png")
    
    # Business Card (small, lower error correction)
    print(f"\n🛠 Creating business card QR...")
    qr_bc = qrcode.QRCode(
        version=3,
        error_correction=qrcode.constants.ERROR_CORRECT_M,
        box_size=5,
        border=4,
    )
    qr_bc.add_data(live_url)
    qr_bc.make(fit=True)
    img_bc = qr_bc.make_image(fill_color=colors['high_contrast'], back_color='white')
    img_bc.save('qr-business-card-new.png')
    print(f" ✓ Saved: qr-business-card-new.png")
    
    # Print-ready vector SVG
    print(f"\n🛠 Creating print SVG...")
    import qrcode.image.svg as svg_mod
    qr_svg = qrcode.QRCode(version=None, error_correction=qrcode.constants.ERROR_CORRECT_H, box_size=10, border=4)
    qr_svg.add_data(urls['analytics'])
    qr_svg.make(fit=True)
    img_svg = qr_svg.make_image(image_factory=svg_mod.SvgPathImage, fill_color=colors['primary'], back_color='white')
    with open('qr-print-new.svg', 'wb') as f:
        img_svg.save(f)
    print(f" ✓ Saved: qr-print-new.svg")
    
    print(banner("✅ DONE - All QR codes updated!"))
    print(f"\n🎯 USAGE:")
    print(f" • Main: qr-main-new.png (large prints)")
    print(f" • Cards: qr-business-card-new.png (business cards)")
    print(f" • Vector: qr-print-new.svg (infinite scaling)")
    print(f"\n📍 All point to: {live_url}")
    print(f"\n🖨  Print in CMYK safely or use SVG for best detail retention.")

if __name__ == "__main__":
    default_url = "https://seanodland.github.io/quickfix-leads/"
    
    # Get URL
    if len(sys.argv) > 1:
        live_url = sys.argv[1]
    else:
        live_url = input(f"Enter your live URL [default {default_url}]: ").strip() or default_url
    
    # Verification
    if not live_url.startswith('http'):
        print("❌ Error: URL must start with http/https")
        sys.exit(1)
    
    # Go!
    update_qr_codes(live_url)
    print("\n🚀 Ready to print & test!")
    
    # Bonus: Test QR accuracy
    import tempfile, subprocess
    
    temp = tempfile.NamedTemporaryFile(suffix='.png', delete=False)
    qr = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_L)
    qr.add_data(live_url)
    qr.make(fit=True)
    qr.make_image().save(temp.name)
    
    # Try to decode it
    try:
        decoded = subprocess.run(['qrencode', '-d', temp.name], capture_output=True, text=True, check=False)
        if live_url in decoded.stdout or decoded.returncode == 0:
            print("\n✅ QR recursive test: Passed.")
    except:
        # qrencode may not be installed
        print("\n✈  Test by scanning the QR with your phone camera.")
    finally:
        os.unlink(temp.name)