import { Component, AfterViewInit, Renderer2, NgZone, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  private scrollHandler: any;
  private parallaxHandler: any;

  constructor(private renderer: Renderer2, private ngZone: NgZone) {}


  faqs = [
    { question: 'How to apply for a farmer ID card online?', answer: 'You can apply by filling out the application form and uploading required documents on our portal.' },
    { question: 'What documents are required for farmer ID registration?', answer: 'Aadhaar card, land records, and a recent photograph.' },
    { question: 'What are the benefits of a farmer ID?', answer: 'Access to government schemes, subsidies, and benefits.' },
    { question: 'How to check farmer ID status?', answer: 'Use the "Track Status" feature on our website.' },
    { question: 'What is Agristack?', answer: 'A government digital database to support farmers.' },
    { question: 'How to update details?', answer: 'Log in and edit your profile.' },
    { question: 'Is farmer ID mandatory?', answer: 'Not always, but it helps access schemes easily.' },
    { question: 'Can I download my farmer ID?', answer: 'Yes, after approval you can download it.' }
  ];

  ngAfterViewInit() {
    this.ngZone.runOutsideAngular(() => {
      this.scrollHandler = this.renderer.listen('window', 'scroll', () => {
        this.revealOnScroll();
        this.updateParallax();
      });
      // Initial check in case elements are already in view
      setTimeout(() => {
        this.revealOnScroll();
        this.updateParallax();
      }, 100);
    });
  }

  ngOnDestroy() {
    if (this.scrollHandler) this.scrollHandler();
  }

  private revealOnScroll() {
    const elements = document.querySelectorAll('.animate-on-scroll');
    const windowHeight = window.innerHeight;
    elements.forEach(el => {
      const rect = (el as HTMLElement).getBoundingClientRect();
      if (rect.top < windowHeight - 60) {
        (el as HTMLElement).classList.add('visible');
      }
    });
  }

  private updateParallax() {
    const featuresSection = document.querySelector('.features-section') as HTMLElement;
    if (featuresSection) {
      const scrollY = window.scrollY || window.pageYOffset;
      const parallax = featuresSection.querySelector('::before');
      // Instead, update the CSS variable for ::before
      featuresSection.style.setProperty('--parallax-offset', `${scrollY * 0.18}px`);
      // The CSS will use this variable for transform
    }
  }
}
