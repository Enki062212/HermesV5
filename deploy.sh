#!/bin/bash
# Hermes + Exponify Production Deployment Script

set -e

echo "═══════════════════════════════════════════════════════════════"
echo "  Hermes + Exponify Production Deployment"
echo "═══════════════════════════════════════════════════════════════"

# Configuration
IMAGE_NAME="hermes-exponify"
VERSION="${1:-v1.0.0}"
REGISTRY="${2:-}"

echo ""
echo "📦 Building production image: ${IMAGE_NAME}:${VERSION}"
echo ""

# Build production image
docker build --target production -t ${IMAGE_NAME}:${VERSION} .

# Tag with registry if provided
if [ -n "$REGISTRY" ]; then
    echo ""
    echo "🏷️  Tagging for registry: ${REGISTRY}"
    docker tag ${IMAGE_NAME}:${VERSION} ${REGISTRY}/${IMAGE_NAME}:${VERSION}
    docker tag ${IMAGE_NAME}:${VERSION} ${REGISTRY}/${IMAGE_NAME}:latest
    
    echo ""
    echo "📤 Pushing to registry..."
    docker push ${REGISTRY}/${IMAGE_NAME}:${VERSION}
    docker push ${REGISTRY}/${IMAGE_NAME}:latest
fi

echo ""
echo "✅ Build complete!"
echo ""
echo "To run locally:"
echo "  docker run -d -p 80:80 --name hermes ${IMAGE_NAME}:${VERSION}"
echo ""
echo "To deploy to server:"
echo "  docker run -d -p 80:80 --name hermes ${REGISTRY}/${IMAGE_NAME}:${VERSION}"
echo ""
