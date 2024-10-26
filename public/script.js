const slider = document.querySelector(".slider");
const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");

let currentIndex = 0;
const totalSlides = slider.children.length;
let autoSlideInterval;

function slideTo(index) {
  currentIndex = index;
  const translateX = -currentIndex * 100;
  slider.style.transform = `translateX(${translateX}%)`;
}

function startAutoSlide() {
  autoSlideInterval = setInterval(() => {
    nextSlide();
  }, 3000);
}

function stopAutoSlide() {
  clearInterval(autoSlideInterval);
}

function nextSlide() {
  currentIndex = (currentIndex + 1) % totalSlides;
  slideTo(currentIndex);
}

function prevSlide() {
  currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
  slideTo(currentIndex);
}

nextBtn.addEventListener("click", () => {
  stopAutoSlide();
  nextSlide();
  startAutoSlide();
});

prevBtn.addEventListener("click", () => {
  stopAutoSlide();
  prevSlide();
  startAutoSlide();
});

startAutoSlide();
