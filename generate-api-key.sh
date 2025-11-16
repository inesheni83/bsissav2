#!/bin/bash

# =============================================================================
# API Key Generator - Bsissa
# =============================================================================
# Génère des clés API sécurisées
# Usage: ./generate-api-key.sh [length]
# =============================================================================

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# Default length
LENGTH=${1:-64}

# Validate length
if [ "$LENGTH" -lt 32 ]; then
    echo -e "${YELLOW}⚠️  Avertissement: Longueur minimale recommandée: 32 caractères${NC}"
    LENGTH=32
fi

echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}              🔐 Générateur de Clés API - Bsissa${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "Longueur de la clé: ${GREEN}${LENGTH}${NC} caractères"
echo ""

# Function to generate keys
generate_hex() {
    openssl rand -hex $(($1 / 2))
}

generate_base64() {
    openssl rand -base64 $1 | tr -d '\n' | tr '+/' '-_' | head -c $1
}

generate_uuid() {
    if command -v uuidgen &> /dev/null; then
        uuidgen | tr '[:upper:]' '[:lower:]'
    else
        cat /proc/sys/kernel/random/uuid 2>/dev/null || python3 -c "import uuid; print(uuid.uuid4())"
    fi
}

echo -e "${CYAN}┌─────────────────────────────────────────────────────────────┐${NC}"
echo -e "${CYAN}│ Type 1: Clé Hexadécimale (recommandé pour API)             │${NC}"
echo -e "${CYAN}└─────────────────────────────────────────────────────────────┘${NC}"
HEX_KEY=$(generate_hex $LENGTH)
echo -e "${GREEN}API_KEY=${HEX_KEY}${NC}"
echo ""

echo -e "${CYAN}┌─────────────────────────────────────────────────────────────┐${NC}"
echo -e "${CYAN}│ Type 2: Clé Hexadécimale avec Préfixe                      │${NC}"
echo -e "${CYAN}└─────────────────────────────────────────────────────────────┘${NC}"
PREFIXED_KEY="bsissa_$(generate_hex $LENGTH)"
echo -e "${GREEN}API_KEY=${PREFIXED_KEY}${NC}"
echo ""

echo -e "${CYAN}┌─────────────────────────────────────────────────────────────┐${NC}"
echo -e "${CYAN}│ Type 3: Clé Base64 URL-Safe                                │${NC}"
echo -e "${CYAN}└─────────────────────────────────────────────────────────────┘${NC}"
BASE64_KEY=$(generate_base64 $(($LENGTH * 3 / 4)))
echo -e "${GREEN}API_KEY=${BASE64_KEY}${NC}"
echo ""

echo -e "${CYAN}┌─────────────────────────────────────────────────────────────┐${NC}"
echo -e "${CYAN}│ Type 4: UUID v4 (Standard)                                 │${NC}"
echo -e "${CYAN}└─────────────────────────────────────────────────────────────┘${NC}"
UUID=$(generate_uuid)
echo -e "${GREEN}API_KEY=${UUID}${NC}"
echo ""

echo -e "${CYAN}┌─────────────────────────────────────────────────────────────┐${NC}"
echo -e "${CYAN}│ Type 5: UUID v4 sans tirets                                │${NC}"
echo -e "${CYAN}└─────────────────────────────────────────────────────────────┘${NC}"
UUID_NO_DASH=$(generate_uuid | tr -d '-')
echo -e "${GREEN}API_KEY=${UUID_NO_DASH}${NC}"
echo ""

echo -e "${CYAN}┌─────────────────────────────────────────────────────────────┐${NC}"
echo -e "${CYAN}│ Type 6: Clé Laravel Style (base64:...)                     │${NC}"
echo -e "${CYAN}└─────────────────────────────────────────────────────────────┘${NC}"
LARAVEL_KEY="base64:$(openssl rand -base64 32 | tr -d '\n')"
echo -e "${GREEN}API_KEY=${LARAVEL_KEY}${NC}"
echo ""

echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}                    💡 RECOMMANDATIONS${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${GREEN}✓${NC} Stockez la clé dans le fichier .env"
echo -e "${GREEN}✓${NC} Ne committez JAMAIS la clé dans git"
echo -e "${GREEN}✓${NC} Utilisez différentes clés pour dev/staging/prod"
echo -e "${GREEN}✓${NC} Régénérez les clés périodiquement"
echo -e "${GREEN}✓${NC} Longueur minimale recommandée: 32 caractères"
echo -e "${GREEN}✓${NC} Longueur optimale: 64 caractères"
echo ""

echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}               📝 UTILISATION DANS .env${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo ""
echo "Ajoutez cette ligne dans votre fichier .env:"
echo ""
echo -e "${YELLOW}API_KEY=${HEX_KEY}${NC}"
echo ""
echo "Ou pour Railway/Production:"
echo ""
echo -e "${YELLOW}export API_KEY=\"${HEX_KEY}\"${NC}"
echo ""

echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo ""

# Option to save to file
read -p "Voulez-vous sauvegarder la clé dans un fichier? (y/N) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    FILENAME="api-key-$(date +%Y%m%d_%H%M%S).txt"
    cat > "$FILENAME" << EOF
# API Key générée le $(date)
# Pour l'application Bsissa

# Type 1: Hexadécimal (recommandé)
API_KEY=${HEX_KEY}

# Type 2: Avec préfixe
API_KEY=${PREFIXED_KEY}

# Type 3: Base64 URL-Safe
API_KEY=${BASE64_KEY}

# Type 4: UUID v4
API_KEY=${UUID}

# Type 5: UUID sans tirets
API_KEY=${UUID_NO_DASH}

# Type 6: Laravel Style
API_KEY=${LARAVEL_KEY}

# Instructions:
# 1. Copiez la clé de votre choix dans le fichier .env
# 2. Supprimez ce fichier après utilisation
# 3. Ne committez JAMAIS ce fichier dans git
EOF
    echo -e "${GREEN}✓ Clé sauvegardée dans: ${FILENAME}${NC}"
    echo -e "${YELLOW}⚠️  N'oubliez pas de supprimer ce fichier après utilisation!${NC}"
fi
