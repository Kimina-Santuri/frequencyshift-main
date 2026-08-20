(() => {
    const canvas = document.createElement('canvas');
    canvas.id = 'topographic';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.prepend(canvas);

    const context = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let ratio = 1;
    let pointerX = .5;
    let pointerY = .5;
    let smoothX = .5;
    let smoothY = .5;

    function resize() {
        ratio = Math.min(window.devicePixelRatio || 1, 2);
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width * ratio;
        canvas.height = height * ratio;
        context.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', event => {
        pointerX = event.clientX / width;
        pointerY = event.clientY / height;
    });

    function draw(time) {
        context.clearRect(0, 0, width, height);
        smoothX += (pointerX - smoothX) * .035;
        smoothY += (pointerY - smoothY) * .035;

        const lines = Math.max(180, Math.floor(width / 8));
        const points = 110;
        const spacing = width / (lines - 1);
        const phase = time * .00018;
        const mouseX = smoothX * width;
        const mouseY = smoothY * height;
        const radius = Math.min(width, height) * .38;

        context.strokeStyle = 'rgba(32, 30, 31, .22)';
        context.lineWidth = .65;

        for (let line = 0; line < lines; line += 1) {
            const baseX = line * spacing;
            context.beginPath();

            for (let point = 0; point <= points; point += 1) {
                const normalizedY = point / points;
                const y = normalizedY * height;
                const wave =
                    Math.sin(normalizedY * Math.PI * 2.3 + phase) * 18 +
                    Math.sin(normalizedY * Math.PI * 5.1 - phase * .7) * 10;
                const dx = baseX - mouseX;
                const dy = y - mouseY;
                const distance = Math.hypot(dx, dy);
                const influence = Math.max(0, 1 - distance / radius);
                const push = (mouseX - baseX) * .035 * influence * influence;
                const x = baseX + wave + push;

                if (point === 0) context.moveTo(x, y);
                else context.lineTo(x, y);
            }

            context.stroke();
        }

        requestAnimationFrame(draw);
    }

    resize();
    requestAnimationFrame(draw);
})();
