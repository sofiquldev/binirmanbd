<!-- start of hero -->
<section class="static-hero">
    <div class="hero-container">
        <div class="hero-inner">
            <div class="container-fluid">
                <div class="hero-content">
                    <div data-swiper-parallax="300" class="slide-title-sub">
                        <span>{{ $constituencyName }}</span>
                    </div>
                    <div data-swiper-parallax="300" class="slide-title">
                        <h2>{{ $candidateName }}</h2>
                    </div>
                    <div data-swiper-parallax="400" class="slide-text">
                        <p>{{ $campaignSlogan }}</p>
                    </div>
                    <div class="clearfix"></div>
                    <div data-swiper-parallax="500" class="slide-btns">
                        <a href="{{ $donationUrl }}" class="theme-btn">{{ __('template.common.donate_now') }}</a>
                    </div>
                    <div class="politian-pic">
                        <img src="{{ $heroImage }}" alt="{{ $candidateName }}" onerror="this.src='{{ $assetBaseUrl }}/assets/images/slider/1.png'">
                        <div class="politian-shape">
                            <div class="shape-1 wow zoomIn" data-wow-duration="2000ms"></div>
                            <div class="shape-2 wow zoomIn" data-wow-duration="1500ms"></div>
                            <div class="shape-3 wow zoomIn" data-wow-duration="1000ms"></div>
                            <div class="shape-4 wow zoomIn" data-wow-duration="500ms"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
<!-- end of hero slider -->

<!-- start of features -->
<section class="wpo-features-area">
    <div class="container">
        <div class="features-wrap">
            <div class="row">
                <div class="col col-lg-3 col-md-6 col-12">
                    <div class="feature-item-wrap" style="cursor: pointer;" onclick="openMissionModal()">
                        <div class="feature-item">
                            <div class="icon">
                                <i class="fi flaticon-goal"></i>
                            </div>
                            <div class="feature-text">
                                <h2><a href="javascript:void(0);">{{ __('template.features.our_mission') }}</a></h2>
                            </div>
                        </div>
                        <div class="feature-item-hidden">
                            <div class="icon">
                                <i class="fi flaticon-goal"></i>
                            </div>
                            <div class="feature-text">
                                <h2><a href="javascript:void(0);">{{ __('template.features.our_mission') }}</a></h2>
                                <p>{{ __('template.features.mission_description') }}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col col-lg-3 col-md-6 col-12">
                    <div class="feature-item-wrap" style="cursor: pointer;" onclick="openVisionModal()">
                        <div class="feature-item">
                            <div class="icon">
                                <i class="fi flaticon-conference-1"></i>
                            </div>
                            <div class="feature-text">
                                <h2><a href="javascript:void(0);">{{ __('template.features.our_vision') }}</a></h2>
                            </div>
                        </div>
                        <div class="feature-item-hidden">
                            <div class="icon">
                                <i class="fi flaticon-conference-1"></i>
                            </div>
                            <div class="feature-text">
                                <h2><a href="javascript:void(0);">{{ __('template.features.our_vision') }}</a></h2>
                                <p>{{ __('template.features.vision_description') }}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col col-lg-3 col-md-6 col-12">
                    <div class="feature-item-wrap active">
                        <div class="feature-item">
                            <div class="icon">
                                <i class="fi flaticon-charity"></i>
                            </div>
                            <div class="feature-text">
                                <h2><a href="{{ $donationUrl }}">{{ __('template.features.make_donation') }}</a></h2>
                            </div>
                        </div>
                        <div class="feature-item-hidden">
                            <div class="icon">
                                <i class="fi flaticon-charity"></i>
                            </div>
                            <div class="feature-text">
                                <h2><a href="{{ $donationUrl }}">{{ __('template.features.make_donation') }}</a></h2>
                                <p>{{ __('template.features.donation_description') }}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col col-lg-3 col-md-6 col-12">
                    <div class="feature-item-wrap" style="cursor: pointer;" onclick="window.location.href='{{ $feedbackUrl }}'">
                        <div class="feature-item">
                            <div class="icon">
                                <i class="fi flaticon-community"></i>
                            </div>
                            <div class="feature-text">
                                <h2><a href="{{ $feedbackUrl }}">{{ __('template.features.complaint') }}</a></h2>
                            </div>
                        </div>
                        <div class="feature-item-hidden">
                            <div class="icon">
                                <i class="fi flaticon-community"></i>
                            </div>
                            <div class="feature-text">
                                <h2><a href="{{ $feedbackUrl }}">{{ __('template.features.complaint') }}</a></h2>
                                <p>{{ __('template.features.complaint_description') }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
<!-- end of features slider -->

<!-- start of wpo-about-section -->
<section class="wpo-about-section section-padding">
    <div class="container">
        <div class="wpo-about-wrap">
            <div class="row align-items-center">
                <div class="col-lg-6 col-md-12 col-12">
                    <div class="wpo-about-img">
                        <img src="{{ $aboutImage }}" alt="{{ $candidateName }}" onerror="this.src='{{ $assetBaseUrl }}/assets/images/about.jpg'">
                        <div class="wpo-about-img-text">
                            @if($partyLogo)
                            <div style="text-align: center; margin-bottom: 15px;">
                                <img src="{{ $partyLogo }}" alt="{{ $partyName }}" style="max-width: 120px; max-height: 120px; object-fit: contain; border-radius: 50%; background: #fff; padding: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);" onerror="this.style.display='none';">
                            </div>
                            @else
                            <h4>1998</h4>
                            <div class="rotate-text">
                                <span class="wow zoomIn" data-wow-duration="1500ms">W</span>
                                <span class="wow zoomIn" data-wow-duration="1600ms">e</span>
                                <span class="wow zoomIn" data-wow-duration="1700ms">A</span>
                                <span class="wow zoomIn" data-wow-duration="1800ms">r</span>
                                <span class="wow zoomIn" data-wow-duration="1900ms">e</span>
                                <span class="wow zoomIn" data-wow-duration="2000ms">W</span>
                                <span class="wow zoomIn" data-wow-duration="2100ms">o</span>
                                <span class="wow zoomIn" data-wow-duration="2200ms">r</span>
                                <span class="wow zoomIn" data-wow-duration="2300ms">k</span>
                                <span class="wow zoomIn" data-wow-duration="2400ms">i</span>
                                <span class="wow zoomIn" data-wow-duration="2500ms">n</span>
                                <span class="wow zoomIn" data-wow-duration="2600ms">g</span>
                                <span class="wow zoomIn" data-wow-duration="2700ms">F</span>
                                <span class="wow zoomIn" data-wow-duration="2800ms">o</span>
                                <span class="wow zoomIn" data-wow-duration="2900ms">r</span>
                                <span class="wow zoomIn" data-wow-duration="3000ms">Y</span>
                                <span class="wow zoomIn" data-wow-duration="3100ms">o</span>
                                <span class="wow zoomIn" data-wow-duration="3200ms">u</span>
                                <span class="wow zoomIn" data-wow-duration="3300ms">S</span>
                                <span class="wow zoomIn" data-wow-duration="3400ms">i</span>
                                <span class="wow zoomIn" data-wow-duration="3500ms">n</span>
                                <span class="wow zoomIn" data-wow-duration="3600ms">c</span>
                                <span class="wow zoomIn" data-wow-duration="3700ms">e</span>
                            </div>
                            <div class="dots">
                                <span class="wow fadeInUp" data-wow-duration="1400ms"></span>
                                <span class="wow fadeInUp" data-wow-duration="1300ms"></span>
                                <span class="wow fadeInUp" data-wow-duration="1200ms"></span>
                            </div>
                            @endif
                            <div class="border-shape-1 wow zoomIn" data-wow-duration="1500ms"></div>
                            <div class="border-shape-2 wow zoomIn" data-wow-duration="1000ms"></div>
                            <div class="border-shape-3 wow zoomIn" data-wow-duration="500ms"></div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-6 col-md-12 col-12">
                    <div class="wpo-about-text">
                        <div class="wpo-section-title">
                            <span>{{ __('template.about.about', ['name' => $candidateName]) }}</span>
                            <h2>{{ $campaignSlogan }}</h2>
                        </div>
                        <p>{!! nl2br(e($about)) !!}</p>
                        <div class="quote">
                            <p>{!! nl2br(e($missionText)) !!}</p>
                            <p>{!! nl2br(e($visionText)) !!}</p>
                        </div>
                        <div class="wpo-about-left-info">
                            <div class="wpo-about-left-inner">
                                <div class="wpo-about-left-text">
                                    <h5>{{ $candidateName }}</h5>
                                    <span>{{ $partyName }} - {{ $constituencyName }}</span>
                                </div>
                            </div>
                            <div class="signeture">
                                <img src="{{ $signatureImage }}" alt="">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
<!-- end of wpo-about-section -->

<!-- start wpo-donors-section -->
<section class="wpo-donors-section">
    <div class="container">
        <div class="wpo-donors-wrap">
            <div class="row align-items-center">
                <div class="col-lg-6">
                    <h2>{{ __('template.about.would_you_like_to_become_donor') }}</h2>
                </div>
                <div class="col-lg-6">
                    <div class="donors-btn">
                        <a href="{{ $donationUrl }}">{{ __('template.common.donate_now') }}</a>
                        <a href="{{ $donationUrl }}">{{ __('template.about.other_amount') }}</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
<!-- end donors-section -->

<!-- start of wpo-service-section -->
<section class="wpo-service-section section-padding">
    <div class="container">
        <div class="row">
            <div class="col-12">
                <div class="wpo-section-title">
                    <span>{{ __('template.manifesto.title') }}</span>
                    <h2><small>{{ __('template.manifesto.our_commitments_to') }} </small> {{ $constituencyName }}</h2>
                    <p>{{ __('template.manifesto.focused_pledges_from', ['name' => $candidateName]) }}</p>
                </div>
            </div>
        </div>
        <div class="row-grid wpo-service-slider owl-carousel">
            {!! $manifestosHtml !!}
        </div>
    </div>
</section>
<!-- end of wpo-service-section -->

<!--Start wpo-testimonial-section-->
<section class="wpo-testimonial-section">
    <div class="container">
        <div class="wpo-testimonial-wrap">
            <div class="row align-items-center">
                <div class="col-lg-6 col-12 order-lg-1 order-2">
                    <div class="testimonial-left">
                        <div class="testimonial-left-inner">
                            <div class="left-slide">
                                {!! $testimonials['images'] !!}
                            </div>
                            <div class="shape-1"></div>
                            <div class="border-s1"></div>
                            <div class="border-s2"></div>
                            <div class="border-s3"></div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-6 col-12 order-lg-1 order-1">
                    <div class="wpo-testimonial-items">
                        <div class="right-slide">
                            {!! $testimonials['items'] !!}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
<!--End wpo-testimonial-section-->

<!-- start wpo-fun-fact-section -->
<section class="wpo-fun-fact-section">
    <div class="right-bg" style="background-image: url('{{ $videoThumb }}'); background-size: cover; background-position: center;">
        <a href="{{ $videoUrl }}" class="video-btn" data-type="iframe">
            <i class="fi flaticon-play"></i>
        </a>
    </div>
    <div class="container-fluid">
        <div class="row">
            <div class="col col-lg-6">
                <div class="wpo-fun-fact-wrap">
                    <div class="wpo-fun-fact-grids clearfix">
                        @foreach($funfacts as $index => $funfact)
                        <div class="grid">
                            <div class="info">
                                <h3>
                                    <span class="odometer" data-count="{{ $funfact['number'] }}">{{ $funfact['number'] }}</span>
                                    <span class="suffix">{{ $funfact['suffix'] }}</span>
                                </h3>
                                <p>{{ $funfact['label'] }}</p>
                            </div>
                        </div>
                        @endforeach
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
<!-- end wpo-fun-fact-section -->

<!-- Mission Modal -->
<div id="missionModal" class="custom-modal" style="display: none; position: fixed; z-index: 10000; left: 0; top: 0; width: 100%; height: 100%; overflow: auto; background-color: rgba(0,0,0,0.5);">
    <div class="modal-content" style="background-color: #fefefe; margin: 5% auto; padding: 30px; border: 1px solid #888; width: 90%; max-width: 600px; border-radius: 10px; box-shadow: 0 4px 20px rgba(0,0,0,0.3);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h2 style="margin: 0; color: #333; font-size: 1.75rem;">{{ __('template.modals.mission_title') }}</h2>
            <span class="close-modal" onclick="closeMissionModal()" style="color: #aaa; font-size: 28px; font-weight: bold; cursor: pointer; line-height: 20px;">&times;</span>
        </div>
        <div style="color: #555; line-height: 1.8; font-size: 1rem;">
            {!! nl2br(e($missionText ?: __('template.modals.mission_default'))) !!}
        </div>
    </div>
</div>

<!-- Vision Modal -->
<div id="visionModal" class="custom-modal" style="display: none; position: fixed; z-index: 10000; left: 0; top: 0; width: 100%; height: 100%; overflow: auto; background-color: rgba(0,0,0,0.5);">
    <div class="modal-content" style="background-color: #fefefe; margin: 5% auto; padding: 30px; border: 1px solid #888; width: 90%; max-width: 600px; border-radius: 10px; box-shadow: 0 4px 20px rgba(0,0,0,0.3);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h2 style="margin: 0; color: #333; font-size: 1.75rem;">{{ __('template.modals.vision_title') }}</h2>
            <span class="close-modal" onclick="closeVisionModal()" style="color: #aaa; font-size: 28px; font-weight: bold; cursor: pointer; line-height: 20px;">&times;</span>
        </div>
        <div style="color: #555; line-height: 1.8; font-size: 1rem;">
            {!! nl2br(e($visionText ?: __('template.modals.vision_default'))) !!}
        </div>
    </div>
</div>

<style>
.custom-modal .modal-content {
    animation: modalFadeIn 0.3s;
}
@keyframes modalFadeIn {
    from {opacity: 0; transform: translateY(-50px);}
    to {opacity: 1; transform: translateY(0);}
}
.close-modal:hover {
    color: #000;
}
</style>

<script>
function openMissionModal() {
    document.getElementById('missionModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeMissionModal() {
    document.getElementById('missionModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

function openVisionModal() {
    document.getElementById('visionModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeVisionModal() {
    document.getElementById('visionModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Close modal when clicking outside of it
window.onclick = function(event) {
    const missionModal = document.getElementById('missionModal');
    const visionModal = document.getElementById('visionModal');
    if (event.target == missionModal) {
        closeMissionModal();
    }
    if (event.target == visionModal) {
        closeVisionModal();
    }
}

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeMissionModal();
        closeVisionModal();
    }
});
</script>

