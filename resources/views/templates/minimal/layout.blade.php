<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="author" content="wpOceans">
    <link rel="shortcut icon" type="image/png" href="{{ asset('assets/media/brand-logos/binirman-favicon.png') }}">
    <title>{{ $title ?? ($candidateName . ' - Political Campaign') }}</title>
    <link href="{{ $assetBaseUrl }}/assets/css/themify-icons.css" rel="stylesheet">
    <link href="{{ $assetBaseUrl }}/assets/css/flaticon.css" rel="stylesheet">
    <link href="{{ $assetBaseUrl }}/assets/css/font-awesome.min.css" rel="stylesheet">
    <link href="{{ $assetBaseUrl }}/assets/css/bootstrap.min.css" rel="stylesheet">
    <link href="{{ $assetBaseUrl }}/assets/css/animate.css" rel="stylesheet">
    <link href="{{ $assetBaseUrl }}/assets/css/owl.carousel.css" rel="stylesheet">
    <link href="{{ $assetBaseUrl }}/assets/css/owl.theme.css" rel="stylesheet">
    <link href="{{ $assetBaseUrl }}/assets/css/slick.css" rel="stylesheet">
    <link href="{{ $assetBaseUrl }}/assets/css/slick-theme.css" rel="stylesheet">
    <link href="{{ $assetBaseUrl }}/assets/css/swiper.min.css" rel="stylesheet">
    <link href="{{ $assetBaseUrl }}/assets/css/owl.transitions.css" rel="stylesheet">
    <link href="{{ $assetBaseUrl }}/assets/css/jquery.fancybox.css" rel="stylesheet">
    <link href="{{ $assetBaseUrl }}/assets/css/odometer-theme-default.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link href="{{ $assetBaseUrl }}/assets/sass/style.css" rel="stylesheet">
    <link href="{{ $assetBaseUrl }}/assets/sass/custom.css" rel="stylesheet">
    @if(!empty($customCss))
    <style>{!! $customCss !!}</style>
    @endif
    <style>
        /* Fix header visibility */
        #header {
            background: #fff !important;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            position: relative;
            z-index: 999;
            width: 100%;
        }
        #header .wpo-site-header {
            background: #fff !important;
        }
        #header .wpo-site-header-s1 {
            background: #fff !important;
        }
        #header .navigation {
            background: #fff !important;
        }
        #header .navbar {
            background: #fff !important;
        }
        #header .nav.navbar-nav a {
            color: #333 !important;
            font-weight: 500;
        }
        #header .nav.navbar-nav a:hover {
            color: #f05a28 !important;
        }
        #header .navbar-brand {
            color: #333;
        }
        #header .theme-btn {
            background: linear-gradient(135deg, #f05a28 0%, #e04a18 100%);
            color: #fff !important;
            padding: 10px 20px;
            border-radius: 5px;
            text-decoration: none;
            font-weight: 600;
        }
        #header .theme-btn:hover {
            background: linear-gradient(135deg, #e04a18 0%, #d03a08 100%);
        }
    </style>
</head>

<body>
    <!-- start page-wrapper -->
    <div class="page-wrapper">
        <!-- start preloader -->
        <div class="preloader">
            <div class="vertical-centered-box">
                <div class="content">
                    <div class="loader-circle"></div>
                    <div class="loader-line-mask">
                        <div class="loader-line"></div>
                    </div>
                    <img src="{{ $assetBaseUrl }}/assets/images/preloader.png" alt="">
                </div>
            </div>
        </div>
        <!-- end preloader -->

        <!-- Start header -->
        <header id="header">
            <div class="wpo-site-header wpo-site-header-s1">
                <nav class="navigation navbar navbar-expand-lg navbar-light">
                    <div class="container-fluid">
                        <div class="row align-items-center">
                            <div class="col-lg-3 col-md-4 col-3 d-lg-none dl-block">
                                <div class="mobail-menu">
                                    <button type="button" class="navbar-toggler open-btn">
                                        <span class="sr-only">Toggle navigation</span>
                                        <span class="icon-bar first-angle"></span>
                                        <span class="icon-bar middle-angle"></span>
                                        <span class="icon-bar last-angle"></span>
                                    </button>
                                </div>
                            </div>
                            <div class="col-lg-2 col-md-4 col-6">
                                <div class="navbar-header">
                                    <a class="navbar-brand" href="/c/{{ $candidate->slug }}">
                                        <img src="{{ $brandLogo }}" alt="logo" onerror="this.src='{{ $assetBaseUrl }}/assets/images/logo.svg'">
                                    </a>
                                </div>
                            </div>
                            <div class="col-lg-8 col-md-1 col-1">
                                <div id="navbar" class="collapse navbar-collapse navigation-holder">
                                    <button class="menu-close"><i class="ti-close"></i></button>
                                    <ul class="nav navbar-nav mb-2 mb-lg-0">
                                        <li class="menu-item-has-children">
                                            <a class="active" href="/c/{{ $candidate->slug }}">{{ __('template.common.home') }}</a>
                                        </li>
                                        <li><a href="#about-section">{{ __('template.common.about_us') }}</a></li>
                                        <li><a href="#contact-section">{{ __('template.common.contact') }}</a></li>
                                    </ul>
                                </div>
                            </div>
                            <div class="col-lg-2 col-md-3 col-2">
                                <div class="header-right">
                                    <div class="close-form">
                                        <a class="theme-btn" href="{{ $donationUrl }}"><span class="text">{{ __('template.common.donate_now') }}</span>
                                            <span class="mobile">
                                                <i class="fi flaticon-charity"></i>
                                            </span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>
            </div>
        </header>
        <!-- end of header -->

        @if(isset($pageView))
            @include($pageView)
        @endif

        <!-- start of wpo-site-footer-section -->
        <footer class="wpo-site-footer">
            <div class="wpo-upper-footer footer-parallax" style="background-image: url('{{ $footerImage }}'); height: calc(100vh - 50px);">
            </div>
            <div class="wpo-lower-footer">
                <div class="container">
                    <div class="row align-items-center">
                        <div class="col col-lg-6 col-md-12 col-12">
                            <ul>
                                <li>&copy; 2026 <a href="#">Binirman</a>. {{ __('template.common.all_rights_reserved') }}</li>
                            </ul>
                        </div>
                        <div class="col col-lg-6 col-md-12 col-12">
                            <div class="language-switcher">
                                <a href="#" class="lang-btn" data-lang="bn">🇧🇩 বাংলা</a>
                                <a href="#" class="lang-btn" data-lang="en">🇺🇸 English</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
        <!-- end of wpo-site-footer-section -->
    </div>
    <!-- end of page-wrapper -->

    <!-- All JavaScript files -->
    <script src="{{ $assetBaseUrl }}/assets/js/jquery.min.js"></script>
    <script src="{{ $assetBaseUrl }}/assets/js/bootstrap.bundle.min.js"></script>
    <!-- Plugins for this template -->
    <script src="{{ $assetBaseUrl }}/assets/js/modernizr.custom.js"></script>
    <script src="{{ $assetBaseUrl }}/assets/js/jquery.dlmenu.js"></script>
    <script src="{{ $assetBaseUrl }}/assets/js/jquery-plugin-collection.js"></script>
    <!-- Custom script for this template -->
    <script src="{{ $assetBaseUrl }}/assets/js/script.js"></script>
    <style>
        .language-switcher {
            display: flex;
            gap: 10px;
            justify-content: flex-end;
            margin-bottom: 12px;
        }
        .language-switcher .lang-btn {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 6px 10px;
            border: 1px solid #e0e0e0;
            border-radius: 20px;
            font-size: 13px;
            color: #333;
            text-decoration: none;
            background: #fff;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        .language-switcher .lang-btn:hover {
            border-color: #f05a28;
            background: #fff5f2;
        }
        .language-switcher .lang-btn.active {
            border-color: #f05a28;
            color: #f05a28;
            background: #fff5f2;
            box-shadow: 0 0 0 2px rgba(240, 90, 40, 0.08);
        }
    </style>
    <script>
        (function() {
            function setLanguageCookie(lang) {
                const expires = new Date();
                expires.setFullYear(expires.getFullYear() + 1);
                const cookieString = 'preferred_language=' + lang + ';path=/;expires=' + expires.toUTCString() + ';SameSite=Lax';
                document.cookie = cookieString;
                const verify = getCookie('preferred_language');
                if (verify !== lang) {
                    document.cookie = 'preferred_language=' + lang + ';path=/;expires=' + expires.toUTCString();
                }
            }
            
            function getCookie(name) {
                const value = '; ' + document.cookie;
                const parts = value.split('; ' + name + '=');
                if (parts.length === 2) return parts.pop().split(';').shift();
                return null;
            }
            
            const urlParams = new URLSearchParams(window.location.search);
            const urlLang = urlParams.get('lang');
            const normalizedUrlLang = urlLang ? (urlLang.toLowerCase().startsWith('en') ? 'en' : 'bn') : null;
            
            const serverLang = '{{ $locale }}' || 'bn';
            const normalizedServerLang = serverLang.toLowerCase().startsWith('en') ? 'en' : 'bn';
            
            const storedLang = localStorage.getItem('preferred_language');
            const normalizedStoredLang = storedLang ? (storedLang.toLowerCase().startsWith('en') ? 'en' : 'bn') : null;
            
            const cookieLang = getCookie('preferred_language');
            const normalizedCookieLang = cookieLang ? (cookieLang.toLowerCase().startsWith('en') ? 'en' : 'bn') : null;
            
            let currentLang = normalizedServerLang;
            
            if (normalizedUrlLang) {
                currentLang = normalizedUrlLang;
                localStorage.setItem('preferred_language', normalizedUrlLang);
                setLanguageCookie(normalizedUrlLang);
                urlParams.delete('lang');
                const newUrl = window.location.pathname + (urlParams.toString() ? '?' + urlParams.toString() : '');
                window.history.replaceState({}, '', newUrl);
            } else if (normalizedStoredLang) {
                currentLang = normalizedStoredLang;
                if (normalizedStoredLang !== normalizedCookieLang) {
                    setLanguageCookie(normalizedStoredLang);
                }
            } else if (normalizedCookieLang) {
                localStorage.setItem('preferred_language', normalizedCookieLang);
                currentLang = normalizedCookieLang;
            } else {
                localStorage.setItem('preferred_language', normalizedServerLang);
                setLanguageCookie(normalizedServerLang);
            }
            
            document.querySelectorAll('.language-switcher .lang-btn').forEach((btn) => {
                if (btn.dataset.lang === currentLang) {
                    btn.classList.add('active');
                }
                
                btn.addEventListener('click', function(e) {
                    e.preventDefault();
                    const lang = this.dataset.lang;
                    localStorage.setItem('preferred_language', lang);
                    setLanguageCookie(lang);
                    const url = new URL(window.location.href);
                    url.searchParams.set('lang', lang);
                    window.location.href = url.toString();
                });
            });
        })();
    </script>
    @if(!empty($customJs))
    <script>{!! $customJs !!}</script>
    @endif
</body>
</html>

