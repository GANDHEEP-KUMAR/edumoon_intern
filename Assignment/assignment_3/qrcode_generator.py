import qrcode

def main():
    data = input("Enter the text or URL to generate QR code: ")
    if not data.strip():
        print("No input provided. Exiting.")
        return
    img = qrcode.make(data)
    filename = input("Enter filename to save (default: 'qrcode.png'): ") or "qrcode.png"
    img.save(filename)
    print(f"QR code saved as {filename}")

if __name__ == "__main__":
    main()
