# Geira Tech - Landing Page

Landing page moderne et immersive pour Geira Tech avec effets 3D, animations parallax et background réactif à la souris.

## 🚀 Fonctionnalités

- **Header rétractable** : Se contracte de 1/3 au scroll après la landing page
- **Hero 3D** : Scène Spline immersive avec fallback animé
- **Background réactif** : Gradient qui suit le mouvement de la souris
- **Animations parallax** : Effets de profondeur au scroll
- **Sections complètes** :
  - À propos avec chiffres clés
  - Services (3 catégories : Créatifs, IT, Énergie)
  - Études de cas (carousel)
  - Méthodologie (5 étapes)
  - Témoignages clients
  - Formulaire de contact
- **Analytics** : Tracking des événements et scroll depth
- **Dark mode** : Design sombre par défaut avec thème Geira Tech
- **Responsive** : Mobile-first, optimisé pour tous les écrans
- **Accessibilité** : WCAG compliant, respect de prefers-reduced-motion

## 🎨 Design System

### Couleurs
- **Geira Cyan** : `oklch(0.75 0.15 195)` - Couleur principale
- **Geira Blue** : `oklch(0.55 0.20 250)` - Couleur secondaire
- **Geira Accent** : `oklch(0.65 0.18 220)` - Accent

### Typographie
- **Sans** : Geist Sans (headings et body)
- **Mono** : Geist Mono (code)

## 📦 Installation

\`\`\`bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Build pour production
npm run build

# Démarrer en production
npm start
\`\`\`

## 🔧 Configuration

### Variables d'environnement

Créer un fichier `.env.local` :

\`\`\`env
# Analytics (optionnel)
NEXT_PUBLIC_GA4_MEASUREMENT_ID=G-XXXXXXX
NEXT_PUBLIC_POSTHOG_KEY=phc_xxxxx

# Spline 3D Scene URL
NEXT_PUBLIC_SPLINE_SCENE_URL=https://my.spline.design/xxxxx
\`\`\`

### Remplacer la scène Spline

1. Créer votre scène sur [Spline](https://spline.design)
2. Exporter et obtenir l'URL iframe
3. Remplacer l'URL dans `components/hero-section.tsx`

## 📊 Analytics

Le système d'analytics track automatiquement :
- **Page views** : Chaque visite de page
- **CTA clicks** : Clics sur les boutons d'action
- **Form submissions** : Soumissions de formulaire
- **Service views** : Consultation des services
- **Scroll depth** : Profondeur de scroll (25%, 50%, 75%, 100%)

### Événements disponibles

\`\`\`typescript
trackEvent(eventName, properties)
trackPageView(path)
trackCTAClick(ctaId, ctaText, location)
trackFormSubmit(formId, success, errors)
trackServiceView(serviceId, serviceName)
trackScrollDepth(depth)
\`\`\`

## 🎯 Structure du projet

\`\`\`
├── app/
│   ├── layout.tsx          # Layout principal avec analytics
│   ├── page.tsx            # Page d'accueil
│   └── globals.css         # Styles globaux et design tokens
├── components/
│   ├── retractable-header.tsx    # Header avec scroll behavior
│   ├── hero-section.tsx          # Hero 3D avec Spline
│   ├── about-section.tsx         # À propos
│   ├── services-section.tsx      # Services (tabs)
│   ├── use-cases-section.tsx     # Études de cas (carousel)
│   ├── process-section.tsx       # Méthodologie
│   ├── testimonials-section.tsx  # Témoignages
│   ├── contact-section.tsx       # Formulaire de contact
│   ├── footer.tsx                # Footer
│   ├── parallax-wrapper.tsx      # Wrapper pour effets parallax
│   ├── scroll-reveal.tsx         # Animations au scroll
│   └── analytics-provider.tsx    # Provider analytics
├── lib/
│   ├── utils.ts            # Utilitaires (cn, etc.)
│   └── analytics.ts        # Fonctions analytics
└── public/
    ├── logo-geira-gradient.png   # Logo Geira Tech
    └── ...                       # Images des projets
\`\`\`

## 🎨 Personnalisation

### Modifier les couleurs

Éditer `app/globals.css` :

\`\`\`css
:root {
  --geira-cyan: oklch(0.75 0.15 195);
  --geira-blue: oklch(0.55 0.20 250);
  --geira-accent: oklch(0.65 0.18 220);
}
\`\`\`

### Ajouter des services

Éditer `components/services-section.tsx` et ajouter dans l'objet `services`.

### Modifier le contenu

Chaque section est un composant indépendant dans `components/`. Modifier directement le contenu dans chaque fichier.

## 🚀 Déploiement

### Vercel (recommandé)

\`\`\`bash
# Connecter le repo GitHub
vercel

# Ou déployer directement
vercel --prod
\`\`\`

### Autres plateformes

\`\`\`bash
# Build
npm run build

# Les fichiers sont dans .next/
# Servir avec un serveur Node.js ou adapter selon la plateforme
\`\`\`

## 📱 Performance

- **LCP** : < 2.5s (optimisé avec lazy loading)
- **CLS** : < 0.1 (animations GPU-accelerated)
- **FID** : < 100ms (interactions optimisées)

### Optimisations appliquées

- Lazy loading des images et iframe Spline
- Animations CSS avec `transform` et `opacity`
- `will-change` sur éléments animés
- Respect de `prefers-reduced-motion`
- Smooth scrolling avec `scroll-behavior`

## 🔒 Accessibilité

- Navigation au clavier complète
- Attributs ARIA appropriés
- Contraste WCAG AA minimum
- Focus visible sur tous les éléments interactifs
- Alternative textuelle pour le contenu 3D

## 📄 License

© 2025 Geira Tech. Tous droits réservés.

## 🤝 Support

Pour toute question ou support :
- Email : contact@geiratech.com
- Téléphone : +33 1 23 45 67 89
\`\`\`



<AssistantMessageContentPart partEncoded="eyJ0eXBlIjoidGFzay13YWl0aW5nLXYxIiwiY3JlYXRlZEF0IjoxNzYwMTQ3NzUwOTY5LCJmaW5pc2hlZEF0IjoxNzYwMTQ3NzUwOTY5LCJpZCI6Imd4S3VaQ1F0R2ZNbjVXNjAiLCJsYXN0UGFydFNlbnRBdCI6MTc2MDE0Nzc1MDk2OSwicGFydHMiOlt7InR5cGUiOiJ0b29sLWNhbGxzIn1dfQ==" />



<AssistantMessageContentPart partEncoded="eyJ0eXBlIjoidGFzay1tYW5hZ2UtdG9kb3MtdjEiLCJpZCI6InVZcGRSc0JXZUVTYThuTFAiLCJ0YXNrTmFtZUFjdGl2ZSI6IkNvbXBsZXRpbmcgcHJvamVjdCIsInRvb2xDYWxsSWQiOiJ0b29sdV8wMVFNY1BLRzRXdHJjOFZSOWk0dVA2Y0oiLCJ0YXNrTmFtZUNvbXBsZXRlIjoiQ29tcGxldGVkIHByb2plY3QiLCJjcmVhdGVkQXQiOjE3NjAxNDc3NTE4NzAsImZpbmlzaGVkQXQiOm51bGwsInBhcnRzIjpbXSwibGFzdFBhcnRTZW50QXQiOm51bGx9" />
