const comparison = document.querySelector(".comparison");
const sliderHandle = document.querySelector(".handle");

function setPosition(value) {
	const position = Math.max(0, Math.min(100, value));
	comparison.style.setProperty("--position", `${position}%`);
}

function startDragging(event) {
	comparison.classList.add("is-dragging");
	sliderHandle.setPointerCapture(event.pointerId);
}

function updateDragging(event) {
	if (!sliderHandle.hasPointerCapture(event.pointerId)) {
        return;
    };

	const handleBounds = comparison.getBoundingClientRect();
	setPosition(((event.clientX - handleBounds.left) / handleBounds.width) * 100);
}

function stopDragging(event) {
	if (sliderHandle.hasPointerCapture(event.pointerId)) {
		sliderHandle.releasePointerCapture(event.pointerId);
	}
	comparison.classList.remove("is-dragging");
}

// Set event listeners
sliderHandle.addEventListener("pointerdown", startDragging);
sliderHandle.addEventListener("pointermove", updateDragging);
sliderHandle.addEventListener("pointerup", stopDragging);
sliderHandle.addEventListener("pointercancel", stopDragging);

// Set button event listeners
document.querySelectorAll(".photo-button").forEach((button) => {
	button.addEventListener("click", () => setPosition(Number(button.dataset.position)));
});

// Determine Aspect Ratio
const firstImage = comparison.querySelector(".image");
let aspectRatio = 16 / 9;

function fitComparison() {
	const availableWidth = document.documentElement.clientWidth;
	const availableHeight = document.documentElement.clientHeight;
	const width = Math.min(availableWidth, availableHeight * aspectRatio);
	comparison.style.setProperty("--aspect-ratio", aspectRatio);
	comparison.style.width = `${width}px`;
}

function setAspectRatio() {
	if (firstImage.naturalWidth && firstImage.naturalHeight) {
		aspectRatio = firstImage.naturalWidth / firstImage.naturalHeight;
	}
	fitComparison();
}

if (firstImage.complete) {
	setAspectRatio();
} else {
	firstImage.addEventListener("load", setAspectRatio, { once: true });
}
window.addEventListener("resize", fitComparison);