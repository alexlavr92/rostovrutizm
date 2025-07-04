// jquery window onload start
'use strict'
// let docWidth = document.documentElement.clientWidth


jQuery(document).ready(function ($) {


    const DayNNight = {
        defaultOptions: {
            switherTheme: $('.switcher-theme'),
        },
        init: function (options) {
            var options = $.extend(this.defaultOptions, options)
            options.switherElems = options.switherTheme.find('.switcher-elem')
            options.switherCenter = options.switherTheme.find('.switcher-center')
            // console.log(options)
            this.events(options)
        },
        events: function (options) {
            // console.log(options.switherElems)
            options.switherElems.on('click', function (e) {
                if (!$(this).hasClass('active')) {
                    // console.log(options.switherElems)
                    e.preventDefault()
                    options.switherElems.removeClass('active')
                    $(this).addClass('active')
                    $('body').toggleClass('theme-night')
                }
            })
            options.switherCenter.on('click', function (e) {
                e.preventDefault()
                options.switherElems.filter(':not(.active)').trigger('click')
            })
        }
    }
    if ($('.switcher-theme').length) {
        DayNNight.init()
    }


    const StickyTabs = {
        scrollTopLand: $(window).scrollTop(),
        lastScrollTopLand: 0,
        LandTabs: $('.land-page .tabs-section'),
        init: function () {
            if (this.scrollTopLand >= this.LandTabs.offset().top) {
                this.LandTabs.addClass('sticky')
            }
            this.events()
        },
        events: function () {
            const $thisObj = this
            $(window).on('scroll', function (e) {
                $thisObj.scrollTopLand = $(window).scrollTop();

                if ($thisObj.scrollTopLand > $thisObj.lastScrollTopLand) {
                    if ($thisObj.scrollTopLand >= $thisObj.LandTabs.offset().top) {
                        $thisObj.LandTabs.addClass('sticky')
                    }
                }
                else {
                    if ($thisObj.scrollTopLand < $thisObj.LandTabs.offset().top) {
                        $thisObj.LandTabs.removeClass('sticky')
                    }
                }
                $thisObj.lastScrollTopLand = $thisObj.scrollTopLand

            })
        }
    }
    if ($('.land-page .tabs-section').length)
        StickyTabs.init()



    // Работа табов на лендинге
    const TabsInit = {
        TabsSwithers: $('.land-page .tabs-wrapper .tag-elem'),
        TabsContents: $('.land-page .tabs-wrapper .tabs-content'),
        LandTabs: $('.land-page .tabs-section'),
        clickFunction: function (currentSwither) {
            const index = currentSwither.index()
            this.TabsContents.removeClass('active').hide()
            this.TabsContents.eq(index).addClass('active').fadeIn({
                start: function () {
                    window.scrollTo(0, (TabsInit.LandTabs.offset().top - 100))
                },
                complete: function () {
                    AOS.refreshHard();
                }
            })


            if (index != 0) {
                if ($('.land-page').hasClass('.theme-night'))
                    $('.land-page .switcher-theme .switcher-elem:first-child').trigger('click')
                $('.land-page .switcher-theme .switcher-elem:first-child').trigger('click')
                $('.land-page .switcher-theme').hide()

                if (index == 1) {
                    if ($('.land-page .bg-animate').length) {
                        if (AnimateBg.initStatus == false) {
                            AnimateBg.init({
                                animateElems: $('.land-page .bg-animate')
                            })
                        }
                    }
                }
                else {
                    $('body').removeAttr('body-color')
                    $('.land-page .bg-animate.bg-animate-init').removeClass('bg-animate-init')
                }
            }
            else {
                $('.land-page .switcher-theme').show()
                $('body').removeAttr('body-color')
                $('.land-page .bg-animate.bg-animate-init').removeClass('bg-animate-init')
            }

        }
    }
    TabsInit.TabsSwithers.on('click', function (e) {
        e.preventDefault()
        if (!$(this).hasClass('active'))
            TabsInit.clickFunction($(this))
    })
    // -----------------------------------

    const AnimateBg = {
        defaultsOptions: {
            animateElems: $('.land-page .bg-animate'),
            windowWidth: document.body.clientWidth,
            firstIndex: 0,
            lastScrollTop: $(window).scrollTop()
        },
        initStatus: false,
        init: function (options) {
            var options = $.extend(this.defaultsOptions, options)
            this.events(options)
            this.initStatus = true
        },
        events: function (options) {

            const InstallBgColor = function (currentIndex, CurrentAnimateElem, direction) {  // функция установки цвета background body
                let BodyBgClass =
                    CurrentAnimateElem.hasClass('green-outer') ? 'green'
                        : CurrentAnimateElem.hasClass('violet-outer') ? 'violet'
                            : CurrentAnimateElem.hasClass('yellow-outer') ? 'yellow'
                                : CurrentAnimateElem.hasClass('blue-outer') ? 'blue'
                                    : CurrentAnimateElem.hasClass('orange-outer') ? 'orange' : ''
                CurrentAnimateElem.addClass('bg-animate-init')
                // console.log(BodyBgClass)
                if (currentIndex > 0 && direction == 'scroll-down') {
                    $(options.animateElems[currentIndex - 1]).removeClass('bg-animate-init')
                }

                if (currentIndex > 0 && direction == 'scroll-up')
                    $(options.animateElems[currentIndex + 1]).removeClass('bg-animate-init')
                $('body').attr('body-color', BodyBgClass)

            }

            let currentIndex,
                scrollTop = $(window).scrollTop()
            const LastAnimateBgElem = $(options.animateElems[options.animateElems.length - 1]),
                FirstAnimateBgElem = $(options.animateElems[0])

            // console.log(LastAnimateBgElem)
            let LastAnimateBgElemOffset, FirstAnimateBgElemOffset
            function UpdateFirtsLastBgElem() {  // Функция обновления контроля отступов для анимации фона
                LastAnimateBgElemOffset
                    = LastAnimateBgElem.offset().top
                    + LastAnimateBgElem.closest('.new-container').innerHeight()
                FirstAnimateBgElemOffset = FirstAnimateBgElem.offset().top
                // console.log(FirstAnimateBgElemOffset)
            }

            UpdateFirtsLastBgElem()
            $(window).on('resize', function () {
                UpdateFirtsLastBgElem()
            })
            function UpdateCurrentIndex() { // функция установки изначального индекса для анимации фона до старта скрола
                //currentIndex
                $.each(options.animateElems, function (index, elem) {
                    const ScrollTopAndWindows = scrollTop + $(window).height()
                    // console.log($(elem).offset().top)
                    // console.log(scrollTop + $(window).height())
                    // console.log($(elem).offset().top + $(elem).closest('section').innerHeight())

                    if (ScrollTopAndWindows >= $(elem).offset().top
                        && ScrollTopAndWindows <= $(elem).offset().top + $(elem).closest('.new-container').innerHeight()) {
                        // console.log(ScrollTopAndWindows)
                        // console.log($(elem).offset().top)
                        currentIndex = index
                    }
                })
                return currentIndex
            }
            // const $thisObj = this
            // console.log($(options.animateElems[currentIndex]).offset().top)

            currentIndex = $(window).scrollTop() + $(window).height() < FirstAnimateBgElemOffset
                ? 0
                : $(window).scrollTop() >= LastAnimateBgElem.offset().top
                    ? options.animateElems.length - 1
                    : UpdateCurrentIndex()
            // UpdateCurrentIndex()
            // console.log(currentIndex)
            // console.log(FirstAnimateBgElemOffset, LastAnimateBgElemOffset)



            $(window).on('scroll', function (e) {
                if ($('.land-page .tabs-contents .tabs-content:nth-child(2)').hasClass('active')) {
                    scrollTop = $(window).scrollTop();
                    // console.log(scrollTop + $(window).height())
                    // console.log(currentIndex)

                    if (scrollTop + $(window).height() < FirstAnimateBgElemOffset + FirstAnimateBgElem.innerHeight()) currentIndex = 0
                    const CurrentAnimateElem = $(options.animateElems[currentIndex])
                    // console.log(CurrentAnimateElem)
                    let CurrentAnimateElemOffset, CurrentContent
                    if (scrollTop > options.lastScrollTop) {
                        // console.log('сколл вниз ' + currentIndex)
                        // console.log(currentIndex)

                        CurrentAnimateElemOffset = CurrentAnimateElem.offset().top + CurrentAnimateElem.innerHeight()
                        CurrentContent = CurrentAnimateElem.closest('.new-container')
                        // console.log(CurrentContent)
                        // console.log('отступ ' + CurrentAnimateElem.offset().top)
                        if (scrollTop + $(window).height() >= CurrentAnimateElemOffset && !CurrentAnimateElem.hasClass('bg-animate-init')) {
                            // UpdateFirtsLastBgElem()
                            if (scrollTop + $(window).height() <= LastAnimateBgElemOffset) {
                                // console.log('вход в смену цвета вниз')
                                // if ($(options.animateElems[currentIndex + 1]).hasClass('bg-animate-init'))
                                //     $(options.animateElems[currentIndex + 1]).removeClass('bg-animate-init')
                                if (!$(options.animateElems[currentIndex + 1]).hasClass('bg-animate-init'))
                                    InstallBgColor(currentIndex, CurrentAnimateElem, 'scroll-down')

                            }
                        }
                        if (scrollTop + $(window).height() >= (CurrentContent.offset().top + CurrentContent.innerHeight())
                            && currentIndex < options.animateElems.length - 1)
                            currentIndex++
                        if (currentIndex == options.animateElems.length - 1) {
                            UpdateFirtsLastBgElem()
                            if ((scrollTop + $(window).height()) >= LastAnimateBgElemOffset
                                && CurrentAnimateElem.hasClass('bg-animate-init')) {
                                // console.log('тут')
                                $('body').removeAttr('body-color')
                                CurrentAnimateElem.removeClass('bg-animate-init')

                            }
                        }
                    }
                    else {
                        // console.log('скорлл вверх ' + currentIndex)
                        CurrentContent = CurrentAnimateElem.closest('.new-container')
                        CurrentAnimateElemOffset = CurrentContent.offset().top + CurrentContent.innerHeight() / 2
                        if (scrollTop <= CurrentAnimateElemOffset
                            && !CurrentAnimateElem.hasClass('bg-animate-init') && scrollTop > FirstAnimateBgElemOffset) {
                            // console.log('смена цвета наверх')
                            if (!$(options.animateElems[currentIndex - 1]).hasClass('bg-animate-init'))
                                InstallBgColor(currentIndex, CurrentAnimateElem, 'scroll-up')

                        }
                        if (currentIndex > 0 && scrollTop <= CurrentContent.offset().top)
                            currentIndex--
                        if (currentIndex == 0) {
                            if (scrollTop < (FirstAnimateBgElemOffset + FirstAnimateBgElem.closest('.new-container').innerHeight() / 2)
                                && scrollTop >= FirstAnimateBgElemOffset)
                                InstallBgColor(currentIndex, CurrentAnimateElem, 'scroll-up')
                            if (scrollTop <= (FirstAnimateBgElemOffset + FirstAnimateBgElem.closest('.new-container').innerHeight() / 2)) {
                                // console.log('смена с фиолетового')
                                $(options.animateElems[currentIndex + 1]).removeClass('bg-animate-init')
                                // console.log(scrollTop, CurrentAnimateElemOffset)
                            }

                            if (scrollTop <= (FirstAnimateBgElemOffset - $(window).height())
                                && CurrentAnimateElem.hasClass('bg-animate-init')) {
                                $('body').removeAttr('body-color')
                                CurrentAnimateElem.removeClass('bg-animate-init')
                            }
                        }

                    }
                    options.lastScrollTop = scrollTop
                }
            })
        }
    }



    // ------------------------------------

    $('body').on('click', '.accordeon-title', function (e) {
        const $this = $(this),
            accorWrapp = $this.closest('.accordon-wrapper'),
            accorContent = accorWrapp.find('.accordeon-content')
        accorWrapp.toggleClass('open')
        accorContent.slideToggle()
    })


    const WeekAttracionSlider = {
        sliderWrapper: $('.week-attraction .slider-wrapper'),
        init: function (options) {

            if (options.sliderWrapper) {
                this.sliderWrapper = options.sliderWrapper
                // console.log(options)
            }
            const sliderContainer = this.sliderWrapper.find('.swiper-container'),
                PrevArrow = this.sliderWrapper.find('.swiper-button-prev'),
                NextArrow = this.sliderWrapper.find('.swiper-button-next')

            let swiper = new Swiper(sliderContainer, {
                slidesPerView: 5,
                spaceBetween: 22,
                slidesPerGroup: 5,
                speed: 1000,

                // lazy: true,
                watchOverflow: true,
                watchSlidesVisibility: true,
                touchReleaseOnEdges: true,
                // loop: true,
                // autoplay: {
                //     delay: 5000,
                // },
                grabCursor: true,
                navigation: {
                    nextEl: NextArrow,
                    prevEl: PrevArrow,
                },
                observer: true,
                observeParents: true,
                observeSlideChildren: true,
                setWrapperSize: true,
                // pagination: {
                //     el: '.swiper-pagination',
                //     clickable: true,
                //     type: 'bullets',
                // },
                breakpoints: {
                    1199: {
                        slidesPerView: 'auto',
                        spaceBetween: 0,
                        freeMode: true,
                        slidesPerGroup: 1,
                        slidesPerGroupAuto: 'auto',
                        // setWrapperSize: true,
                    },
                    // 767: {
                    //     slidesPerView: 'auto',
                    //     spaceBetween: 10,
                    //     freeMode: true,
                    //     slidesPerGroup: 1,
                    //     slidesPerGroupAuto: 'auto',
                    //     // slidesPerView: 1,
                    //     // slidesPerGroup: 1,
                    // },
                },
                on: {
                    init: function () {



                    },
                    // observerUpdate: function () {
                    //     if (document.body.clientWidth < 1200) {
                    //         const $this = this,
                    //             timeout = 200
                    //         setTimeout(() => {
                    //             $this.updateSlides()
                    //             console.log($this)
                    //         }, timeout);
                    //         // console.log(this)

                    //     }
                    // }
                }
                // autoplay: {
                //     delay: 5000,
                //     disableOnInteraction: false,
                //     pauseOnMouseEnter: true,
                // },
            })
            // console.log(AOS)
        }
    }

    if ($('.week-attraction .slider-wrapper').length) {
        $('.week-attraction .slider-wrapper').each(function (index, elem) {
            WeekAttracionSlider.init({
                sliderWrapper: $(elem)
            })
        })

    }

    const ModalAttractionSlider = {
        sliderWrapper: $('.modal-wrapper .slider-wrapper'),
        init: function (options) {

            if (options.sliderWrapper) {
                this.sliderWrapper = options.sliderWrapper
                // console.log(options)
            }
            const sliderContainer = this.sliderWrapper.find('.swiper-container'),
                PrevArrow = this.sliderWrapper.find('.swiper-button-prev'),
                NextArrow = this.sliderWrapper.find('.swiper-button-next')

            let swiper = new Swiper(sliderContainer, {
                slidesPerView: 1,
                spaceBetween: 20,
                lazy: true,
                // slidesPerGroup: 5,
                speed: 1000,

                // lazy: true,
                watchOverflow: true,
                watchSlidesVisibility: true,
                touchReleaseOnEdges: true,
                // loop: true,
                // autoplay: {
                //     delay: 5000,
                // },
                grabCursor: true,
                navigation: {
                    nextEl: NextArrow,
                    prevEl: PrevArrow,
                },
                observer: true,
                observeParents: true,
                observeSlideChildren: true,

                // pagination: {
                //     el: '.swiper-pagination',
                //     clickable: true,
                //     type: 'bullets',
                // },
                breakpoints: {
                    1199: {
                        spaceBetween: 20,
                        // slidesPerGroup: 1,
                    },
                    767: {
                        spaceBetween: 20,
                        // slidesPerView: 1,
                        // slidesPerGroup: 1,
                    },
                },
                // autoplay: {
                //     delay: 5000,
                //     disableOnInteraction: false,
                //     pauseOnMouseEnter: true,
                // },
            })
        }
    }

    if ($('.modal-wrapper .slider-wrapper').length) {
        $('.modal-wrapper .slider-wrapper').each(function (index, elem) {
            ModalAttractionSlider.init({
                sliderWrapper: $(elem)
            })
        })

    }



    const ModalElem = {
        defaultsOption: {
            modalHash: '',
        },
        init: function (options) {
            this.modalElem = $('#' + options.modalHash + '')

            this.initModal()
            this.events(this.modalElem, options)

        },
        initModal: function () {
            let click_close = true;
            this.modalElem.modal({
                fadeDuration: 150,
                closeExisting: false, // новое 11.07.2022
                closeClass: "close-custom",
                closeText: '<span class="visually-hidden">Закрыть</span>',
                clickClose: click_close, // новое 28.11.2022
            });
        },
        events: function (modalElem, options) {
            $('body').on('modal:open', modalElem, function (event, modal) {

                BlockScroll.open();
            })
            $('body').on('modal:close', modalElem, function (event, modal) {
                BlockScroll.close();
            })
        }
    }


    $('body').on('click', '.modal-open', function (e) {
        e.preventDefault()
        const $this = $(this),
            thisHash = $this.attr('data-modal')
        // console.log(thisHash)
        ModalElem.init({
            // targetElem: $this,
            modalHash: thisHash
        })
        return false;
    })
    // ------------------------------------

})// end doc ready

$(window).on('load', function () {
    let pageBackground = $('.top-section')

    if (docWidth >= 1200)
        pageBackground.on("mousemove", parallax);

    function parallax(event) {
        this.querySelectorAll(".mousemove-elem").forEach((shift) => {
            // console.log(event)
            const position = shift.getAttribute("value");
            const x = (window.innerWidth - event.pageX * position) / 130;
            const y = (window.innerHeight - event.pageY * position) / 130;

            shift.style.transform = `translateX(${x}px) translateY(${y}px)`;
        });
    }
}); // jquery window onload end