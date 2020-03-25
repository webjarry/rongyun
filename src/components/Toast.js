let toast = {
    show(opt) {
        let options = {
        };

        if (typeof opt === 'string') options.title = opt;
        else options = Object.assign(opt, options);

        console.log(options);

        let body = document.body,
            box = document.createElement('div'),
            content = document.createElement('div');

        box.className = 'toast-container';
        box.classList.add('active');

        content.className = 'toast-content';
        content.classList.add('active');
        content.innerText = options.title;

        box.append(content);
        body.append(box);

        box.onclick = function (event) {
            if (event.target.className === 'toast-content active') return false;

            content.classList.remove('active');
            box.classList.remove('active');

            setTimeout(function () {
                box.remove();
            }, 1000);
        };

    },
    hide() {

    }
};
