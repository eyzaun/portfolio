# Portfolio Drift Racing - Modular Game Architecture

Geliştirilmiş modüler yapıya sahip 3D araba drift oyunu.

## 📁 Proje Yapısı

```
game/
├── css/
│   └── game.css              # Oyun stilleri
├── js/
│   ├── components/           # Oyun bileşenleri
│   │   ├── Car.js           # 3D araba modeli ve animasyonları
│   │   ├── World.js         # Pist, binalar, çevre
│   │   └── CollectibleManager.js # Portfolio toplanabilir öğeleri
│   ├── systems/             # Oyun sistemleri
│   │   ├── CarPhysics.js    # Gerçekçi araba fiziği ve drift
│   │   ├── CarControls.js   # Kontrol sistemi ve input yönetimi
│   │   ├── CameraSystem.js  # Dinamik kamera takibi
│   │   ├── CollisionSystem.js # Çarpışma tespiti
│   │   ├── SceneManager.js  # Three.js sahne yönetimi
│   │   └── UISystem.js      # Kullanıcı arayüzü yönetimi
│   ├── utils/               # Yardımcı dosyalar
│   │   └── PortfolioData.js # CV verisi konfigürasyonu
│   ├── Game.js              # Ana oyun sınıfı
│   └── main.js              # Giriş noktası
└── game.html                # Oyun HTML dosyası
```

## 🎮 Modüler Sistem Avantajları

### 🔧 Bakım Kolaylığı
- Her sistem ayrı dosyada
- Tek sorumluluk prensibi
- Bağımsız test edilebilir modüller

### 🚀 Performans
- Lazy loading desteği
- Modüler kod splitting
- Optimize edilmiş dependency yönetimi

### 🎯 Geliştirme Hızı
- Component bazlı geliştirme
- Sistem bazında debugging
- Kolay özellik ekleme/çıkarma

## 🏗️ Sistem Detayları

### CarPhysics.js
- Ackermann steering geometry
- Gerçekçi drift mekaniği
- Velocity based lateral friction
- Drift particle effects

### CarControls.js
- Input smoothing
- Multi-platform control support
- Responsive control mapping
- Customizable key bindings

### CameraSystem.js
- Speed-based camera positioning
- Drift shake effects
- Look-ahead prediction
- Multiple camera modes

### CollisionSystem.js
- Efficient spatial partitioning
- Realistic collision response
- Boundary management
- Collectible interaction

### UISystem.js
- Real-time stat updates
- Dynamic progress tracking
- Dialog management
- Error handling

### World.js
- Procedural environment generation
- Optimized rendering
- Detail level management
- Performance-conscious LOD

## 🎯 Oyun Özellikleri

- **Gerçekçi Araba Fiziği**: Ackermann steering, momentum, drift
- **Portfolio Koleksiyonu**: CV projelerini topla
- **Drift Sistemi**: Authentic drift mechanics
- **Dinamik Kamera**: Speed-responsive follow cam
- **3D Çevre**: Detaylı şehir ve pist
- **Partikül Efektleri**: Drift smoke, collection bursts
- **UI Sistemi**: Real-time stats, progress tracking

## 🚀 Kullanım

```html
<script type="module" src="game/js/main.js"></script>
```

## 🎮 Kontroller

- **WASD**: Araba kontrolü
- **SPACE**: Drift (el freni)
- **ESC**: Menü

## 📊 Performans

- 60 FPS hedefi
- Optimized rendering pipeline
- Efficient collision detection
- Memory-conscious particle system

## 🔧 Geliştirme

Her modül bağımsız olarak geliştirilebilir ve test edilebilir. ES6 modül sistemi kullanılarak modern JavaScript standartlarına uygun yazılmıştır.
