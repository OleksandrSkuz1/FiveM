window.addEventListener('message', function(event) {
    const data = event.data;
    if (data.type === 'toggleMenu') {
        const menu = document.getElementById('menu');
        if (data.state) {
            menu.classList.add('open');
        } else {
            menu.classList.remove('open');
        }
    } else if (data.type === 'updateCursorPosition') {
        // Logic to determine which sector is selected based on cursor position
        const sectors = document.querySelectorAll('.category');
        sectors.forEach(sector => {
            const rect = sector.getBoundingClientRect();
            if (data.x >= rect.left && data.x <= rect.right && data.y >= rect.top && data.y <= rect.bottom) {
                sector.classList.add('selected');
            } else {
                sector.classList.remove('selected');
            }
        });
    } else if (data.type === 'openAnimationSelectionMenu') {
        // Logic to open the animation selection menu for the selected category
        const category = data.category;
        const animations = data.animations;
        const menu = document.getElementById('animation-selection-menu');
        menu.innerHTML = '';
        animations.forEach(animation => {
            const li = document.createElement('li');
            li.textContent = animation;
            li.classList.add('select-animation');
            li.setAttribute('data-category', category);
            li.setAttribute('data-animation', animation);
            menu.appendChild(li);
        });
        menu.classList.add('open');
    } else if (data.type === 'updateQuickAccessAnimations') {
        // Logic to update the quick access animations
        const quickAccessAnimations = data.animations;
        const quickAccessMenu = document.getElementById('quick-access-animations');
        quickAccessMenu.innerHTML = '';
        quickAccessAnimations.forEach(animation => {
            const div = document.createElement('div');
            div.textContent = animation;
            div.classList.add('animation');
            quickAccessMenu.appendChild(div);
        });
    }
});

// Handle animation selection
document.addEventListener('click', function(event) {
    const target = event.target;
    if (target.classList.contains('select-animation')) {
        const category = target.getAttribute('data-category');
        const animation = target.getAttribute('data-animation');
        if (category && animation) {
            fetch(`https://cfx-nui-${GetParentResourceName()}/selectAnimation`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                },
                body: JSON.stringify({ category, animation })
            }).then(response => response.json()).then(data => {
                if (data.status === 'ok') {
                    const menu = document.getElementById('animation-selection-menu');
                    menu.classList.remove('open');
                }
            });
        }
    }
});





