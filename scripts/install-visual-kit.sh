#!/bin/bash
# REIS [IA] Visual Kit Installer
# Installs premium visual dependencies for hero sections, animations, and effects
# Usage: Run from the root of any project that needs visual impact
#   bash /path/to/install-visual-kit.sh

set -e

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  REIS [IA] Visual Kit — Premium Dependencies"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check for package.json
if [ ! -f "package.json" ]; then
  echo "ERROR: No package.json found in $(pwd)"
  echo "Run this script from the root of your project."
  exit 1
fi

echo "[1/5] Installing 3D engine (Three.js + React Three Fiber)..."
npm install three @react-three/fiber @react-three/drei

echo ""
echo "[2/5] Installing shader gradients..."
npm install shadergradient

echo ""
echo "[3/5] Installing animation libraries (GSAP + Framer Motion + Lenis)..."
npm install gsap @gsap/react framer-motion lenis

echo ""
echo "[4/5] Installing particle systems..."
npm install @tsparticles/react @tsparticles/slim

echo ""
echo "[5/5] Installing procedural noise..."
npm install simplex-noise

# Create backgrounds directory
BGDIR="src/components/backgrounds"
if [ ! -d "$BGDIR" ]; then
  echo ""
  echo "Creating $BGDIR/..."
  mkdir -p "$BGDIR"
fi

# Create barrel file if it doesn't exist
BARREL="$BGDIR/index.ts"
if [ ! -f "$BARREL" ]; then
  cat > "$BARREL" << 'BARREL_EOF'
/**
 * REIS [IA] Visual Kit — Background Components
 *
 * Hero and section background components using the premium visual stack.
 * Each component is self-contained with:
 * - Customizable props (colors, speed, intensity)
 * - prefers-reduced-motion fallback
 * - Lazy loading support via React.lazy()
 * - position: absolute + inset: 0 + z-index: 0 by default
 *
 * Usage:
 *   <div className="relative">
 *     <ShaderGradientHero colors={['#e63946', '#0a0a0a', '#1a1a2e']} />
 *     <div className="relative z-10">
 *       {/* Your content */}
 *     </div>
 *   </div>
 *
 * Available components are exported below as they are created.
 */

// Export hero backgrounds here as they are built
// export { default as ShaderGradientHero } from './ShaderGradientHero';
// export { default as ParticleFieldHero } from './ParticleFieldHero';
// export { default as GlowOrbHero } from './GlowOrbHero';
BARREL_EOF
  echo "Created $BARREL"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Visual Kit installed successfully"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "  Installed packages:"
echo "    3D:          three, @react-three/fiber, @react-three/drei"
echo "    Shaders:     shadergradient"
echo "    Animation:   gsap, @gsap/react, framer-motion, lenis"
echo "    Particles:   @tsparticles/react, @tsparticles/slim"
echo "    Noise:       simplex-noise"
echo ""
echo "  Background components directory: $BGDIR/"
echo ""
echo "  Next steps:"
echo "    1. Copy hero components from brain/design-library/hero-components/"
echo "    2. Adapt colors and intensity to your project"
echo "    3. Import with React.lazy() for performance"
echo ""
