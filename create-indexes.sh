#!/bin/bash

echo "🚀 Creating Firestore indexes for pythagoras-eoa..."
echo ""

# Ensure we're in the right directory
if [ ! -f "firestore-indexes.yaml" ]; then
  echo "❌ Error: firestore-indexes.yaml not found in current directory"
  exit 1
fi

# Create indexes
gcloud firestore indexes create firestore-indexes.yaml

echo ""
echo "✅ Indexes creation initiated!"
echo "⏳ Check status with: gcloud firestore indexes list"
echo ""
echo "Note: Indexes may take 5-10 minutes to fully build."
