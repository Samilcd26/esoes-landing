#!/bin/bash

# R2 File Upload System Setup Script
# This script helps you set up the R2 file upload system for your Next.js project

echo "🚀 R2 File Upload System Setup"
echo "==============================="
echo

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
  echo "📋 Creating .env.local file from env.example..."
  cp env.example .env.local
  echo "✅ .env.local created"
  echo
  echo "⚠️  Please edit .env.local and add your actual values:"
  echo "   - Supabase URL and keys"
  echo "   - Cloudflare R2 configuration"
  echo
else
  echo "✅ .env.local already exists"
fi

# Check if Supabase schema is applied
echo "📊 Database Setup"
echo "==================="
echo
echo "⚠️  Make sure to run the database schema in your Supabase SQL Editor:"
echo "   1. Go to your Supabase dashboard"
echo "   2. Navigate to SQL Editor"
echo "   3. Run the queries in supabase-schema.sql"
echo
echo "This will create the 'uploaded_files' table with proper RLS policies."
echo

# R2 Setup instructions
echo "☁️  Cloudflare R2 Setup"
echo "======================="
echo
echo "1. Go to Cloudflare Dashboard"
echo "2. Navigate to R2 Object Storage"
echo "3. Create a new bucket"
echo "4. Create R2 API Token with the following permissions:"
echo "   - Object Storage:Edit"
echo "   - Zone:Read (if using custom domain)"
echo "5. Set up a custom domain (optional but recommended)"
echo "6. Configure CORS in your R2 bucket:"
echo

cat << 'EOF'
[
  {
    "AllowedOrigins": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3600
  }
]
EOF

echo
echo "7. Update your .env.local with:"
echo "   - R2_ENDPOINT: https://your-account-id.r2.cloudflarestorage.com"
echo "   - R2_ACCESS_KEY: Your R2 access key"
echo "   - R2_SECRET_KEY: Your R2 secret key"
echo "   - R2_BUCKET: Your bucket name"
echo "   - R2_PUBLIC_URL: Your custom domain or R2 public URL"
echo

# Usage examples
echo "🎯 Usage Examples"
echo "=================="
echo
echo "1. Basic file upload component:"
echo "   <FileUpload onUploadComplete={handleUpload} />"
echo
echo "2. Using hooks:"
echo "   const { uploadFile, isUploading } = useFileUpload();"
echo
echo "3. List user files:"
echo "   const { data: files } = useUserFiles();"
echo
echo "See FILE_UPLOAD_GUIDE.md for detailed documentation."
echo

# Final checklist
echo "✅ Setup Checklist"
echo "==================="
echo
echo "□ Dependencies installed (npm install)"
echo "□ .env.local configured with your values"
echo "□ Supabase schema applied"
echo "□ Cloudflare R2 bucket created"
echo "□ R2 API token created"
echo "□ CORS configured in R2 bucket"
echo "□ Custom domain configured (optional)"
echo
echo "🎉 You're ready to use the R2 file upload system!"
echo "📚 Check FILE_UPLOAD_GUIDE.md for usage examples"
echo

echo "🔧 Quick Test"
echo "=============="
echo
echo "You can test the file upload system by:"
echo "1. Adding <FileUploadExample /> to any page"
echo "2. Running your Next.js app: npm run dev"
echo "3. Navigate to the page and try uploading a file"
echo

echo "💡 Pro Tips"
echo "============"
echo
echo "• Use compression to reduce storage costs"
echo "• Set appropriate maxSize limits for your use case"
echo "• Monitor your R2 usage and costs"
echo "• Consider implementing file cleanup policies"
echo "• Use CDN for better performance"
echo

echo "🆘 Need Help?"
echo "============="
echo
echo "If you encounter issues:"
echo "1. Check the console for error messages"
echo "2. Verify your environment variables"
echo "3. Test your R2 credentials"
echo "4. Check Supabase RLS policies"
echo "5. Review the FILE_UPLOAD_GUIDE.md"
echo

echo "Setup completed! 🎉" 