import fs from 'fs';
import path from 'path';

async function updateEmail() {
  const emailPath = path.join(process.cwd(), 'lib/orders/confirmationemail.ts');
  const svgPath = path.join(process.cwd(), 'public/Techbar.svg');

  let emailContent = fs.readFileSync(emailPath, 'utf8');
  let svgContent = fs.readFileSync(svgPath, 'utf8')
    .replace('<?xml version="1.0" encoding="UTF-8"?>', '')
    .trim();

  // Re-size SVG for email header
  svgContent = svgContent.replace('width="500" height="500"', 'width="120" style="display: block; margin: 0 auto; margin-bottom: 24px;"');

  // Replace dark mode elements to make it purely Light Mode
  emailContent = emailContent.replace(/background-color: #0f172a;/g, 'background-color: #ffffff; border-bottom: 1px solid #e2e8f0;');
  emailContent = emailContent.replace(/color: #ffffff;/g, 'color: #0f172a;');
  emailContent = emailContent.replace(/color: #94a3b8;/g, 'color: #64748b;');

  // Inject SVG instead of <img>
  emailContent = emailContent.replace(
    /<img src="\${logoUrl}" alt="Techbar Store" width="140" style="display: block; margin: 0 auto; margin-bottom: 24px;" \/>/g,
    svgContent
  );

  fs.writeFileSync(emailPath, emailContent);
  console.log("Updated confirmation email with light mode and embedded SVG.");
}

updateEmail();
