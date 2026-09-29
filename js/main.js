// BURGER MENU
 (function () {
      const burger = document.getElementById('burger');
      const mobileMenu = document.getElementById('mobile-menu');
      const overlay = document.getElementById('mobile-menu-overlay');

      function toggleMenu(open) {
        const isOpen = open !== undefined ? open : !mobileMenu.classList.contains('is-open');
        mobileMenu.classList.toggle('is-open', isOpen);
        overlay.classList.toggle('is-open', isOpen);
        burger.classList.toggle('is-active', isOpen);
        burger.setAttribute('aria-expanded', isOpen);
        document.body.classList.toggle('menu-open', isOpen);
      }

      burger.addEventListener('click', () => toggleMenu());

      overlay.addEventListener('click', () => toggleMenu(false));

      // Закрываем меню при клике по ссылке
      mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => toggleMenu(false));
      });

      // Закрываем по Esc
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
          toggleMenu(false);
        }
      });

      // Закрываем при ресайзе на десктоп
      window.addEventListener('resize', () => {
        if (window.innerWidth > 960 && mobileMenu.classList.contains('is-open')) {
          toggleMenu(false);
        }
      });

      // Кнопка "Заказать" внутри мобильного меню тоже открывает модалку
      mobileMenu.querySelectorAll('[data-open-form]').forEach(btn => {
        btn.addEventListener('click', () => toggleMenu(false));
      });
    })();

    // MODAL window
    (function () {
      const modal = document.getElementById('order-modal');
      const form = document.getElementById('order-form');
      const success = document.getElementById('order-success');
      const cart = document.getElementById('modal-cart');
      const cartList = document.getElementById('modal-cart-list');
      const cartTotal = document.getElementById('modal-cart-total');

      let items = []; // { title, price }

      // ---- Открытие/закрытие ----
      function openModal() {
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');
      }

      function closeModal() {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('modal-open');
        // Сброс через 300мс, чтобы не мигало
        setTimeout(() => {
          form.reset();
          form.hidden = false;
          success.hidden = true;
          items = [];
          renderCart();
        }, 300);
      }

      // ---- Рендер списка товаров ----
      function renderCart() {
        if (items.length === 0) {
          cart.hidden = true;
          return;
        }
        cart.hidden = false;
        cartList.innerHTML = items
          .map(it => `<li><span>${it.title}</span><span>${it.price} ₽</span></li>`)
          .join('');
        const total = items.reduce((sum, it) => sum + it.price, 0);
        cartTotal.textContent = total + ' ₽';
      }

      // ---- Обработчики ----
      // Открытие по всем кнопкам с data-open-form
      document.querySelectorAll('[data-open-form]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();

          // Если клик из карточки товара — добавляем товар
          const product = btn.closest('.product');
          if (product) {
            const title = product.querySelector('.product__title').textContent.trim();
            const priceEl = product.querySelector('.product__price--new') || product.querySelector('.product__price');
            const price = parseInt(priceEl.textContent.replace(/\D/g, ''), 10) || 0;
            // Не добавляем дубли
            if (!items.some(it => it.title === title)) {
              items.push({ title, price });
            }
          }
          renderCart();
          openModal();
        });
      });

      // Закрытие
      modal.querySelectorAll('[data-close-modal]').forEach(el => {
        el.addEventListener('click', closeModal);
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('is-open')) {
          closeModal();
        }
      });

      // ---- Отправка формы ----
      form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Простая валидация
        let valid = true;
        form.querySelectorAll('[required]').forEach(input => {
          if (!input.value.trim()) {
            input.classList.add('is-error');
            valid = false;
          } else {
            input.classList.remove('is-error');
          }
        });
        if (!valid) return;

        // Здесь потом будет реальная отправка (fetch на бэкенд, Telegram, email)
        const data = {
          name: form.name.value,
          phone: form.phone.value,
          address: form.address.value,
          comment: form.comment.value,
          items: items
        };
        console.log('Заявка:', data);

        // Показываем "успех"
        form.hidden = true;
        success.hidden = false;
      });

      // Снимаем подсветку ошибки при вводе
      form.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('input', () => input.classList.remove('is-error'));
      });
    })();

// TABS
    (function () {
      const tabs = document.querySelectorAll('.tab');
      const panels = document.querySelectorAll('.tab-panel');

      tabs.forEach(tab => {
        tab.addEventListener('click', () => {
          tabs.forEach(t => t.classList.remove('is-active'));
          panels.forEach(p => p.classList.remove('is-active'));
          tab.classList.add('is-active');
          document.getElementById('tab-' + tab.dataset.tab).classList.add('is-active');
        });
      });
    })();

    //  АНИМАЦИЯ ПОЯВЛЕНИЯ ПРИ СКРОЛЛЕ 
    (function () {
      const elements = document.querySelectorAll('.reveal');
      if (!elements.length) return;

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 });

      elements.forEach(el => observer.observe(el));
    })();