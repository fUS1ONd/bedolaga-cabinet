import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuthStore } from '../store/auth';
import { useShallow } from 'zustand/shallow';

// Лендинг мебельного магазина — маскировочная страница
// Для авторизованных пользователей без инвайта показывается поле ввода промокода

const PRODUCTS = [
  { id: 1, name: 'Диван "Комфорт"', price: '45 990 ₽', img: '🛋️' },
  { id: 2, name: 'Кресло "Уют"', price: '18 500 ₽', img: '🪑' },
  { id: 3, name: 'Стол обеденный "Модерн"', price: '32 700 ₽', img: '🪵' },
  { id: 4, name: 'Шкаф-купе "Престиж"', price: '67 200 ₽', img: '🚪' },
  { id: 5, name: 'Кровать "Сонник" 160x200', price: '54 900 ₽', img: '🛏️' },
  { id: 6, name: 'Комод "Элегант"', price: '23 400 ₽', img: '🗄️' },
];

export default function Landing() {
  const navigate = useNavigate();
  const { isAuthenticated, user, activateInvite, logout } = useAuthStore(
    useShallow((state) => ({
      isAuthenticated: state.isAuthenticated,
      user: state.user,
      activateInvite: state.activateInvite,
      logout: state.logout,
    })),
  );

  const [promoCode, setPromoCode] = useState('');
  const [promoError, setPromoError] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);

  // Если пользователь авторизован, инвайт активирован и не забанен — редирект на дашборд
  if (isAuthenticated && user?.invite_activated && !user?.is_banned) {
    navigate('/dashboard', { replace: true });
    return null;
  }

  // Показываем ли секцию промокода (авторизован, но без инвайта)
  const showPromoSection = isAuthenticated && user && !user.invite_activated;

  const handlePromoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCode.trim()) return;

    setPromoError('');
    setPromoLoading(true);

    try {
      await activateInvite(promoCode.trim());
      // После успешной активации пользователь будет перенаправлен при ре-рендере
      navigate('/dashboard', { replace: true });
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } } };
      const detail = error.response?.data?.detail;
      setPromoError(detail || 'Ошибка активации промокода');
    } finally {
      setPromoLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Шапка */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏠</span>
            <span className="text-xl font-bold text-gray-800">МебельДом</span>
          </div>
          <nav className="hidden gap-6 text-sm text-gray-600 md:flex">
            <a href="#catalog" className="transition hover:text-gray-900">
              Каталог
            </a>
            <a href="#about" className="transition hover:text-gray-900">
              О нас
            </a>
            <a href="#delivery" className="transition hover:text-gray-900">
              Доставка
            </a>
            <a href="#contacts" className="transition hover:text-gray-900">
              Контакты
            </a>
          </nav>
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <button
                onClick={logout}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 transition hover:bg-gray-50"
              >
                Выйти
              </button>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 transition hover:bg-gray-50"
              >
                Войти
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Герой-секция */}
      <section className="bg-gradient-to-br from-amber-50 to-orange-50 py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <h1 className="mb-4 text-3xl font-bold text-gray-900 md:text-5xl">
            Мебель для вашего дома
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600">
            Более 5000 товаров от ведущих производителей. Бесплатная доставка по Москве и МО.
            Гарантия качества до 5 лет.
          </p>
          <a
            href="#catalog"
            className="inline-block rounded-lg bg-amber-600 px-8 py-3 text-white shadow transition hover:bg-amber-700"
          >
            Перейти в каталог
          </a>
        </div>
      </section>

      {/* Преимущества */}
      <section className="py-12">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 md:grid-cols-3">
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-6 text-center">
            <div className="mb-3 text-3xl">🚚</div>
            <h3 className="mb-1 font-semibold">Бесплатная доставка</h3>
            <p className="text-sm text-gray-500">По Москве при заказе от 15 000 ₽</p>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-6 text-center">
            <div className="mb-3 text-3xl">🛡️</div>
            <h3 className="mb-1 font-semibold">Гарантия 5 лет</h3>
            <p className="text-sm text-gray-500">На весь ассортимент корпусной мебели</p>
          </div>
          <div className="rounded-xl border border-gray-100 bg-gray-50 p-6 text-center">
            <div className="mb-3 text-3xl">💳</div>
            <h3 className="mb-1 font-semibold">Рассрочка 0%</h3>
            <p className="text-sm text-gray-500">До 24 месяцев без переплат</p>
          </div>
        </div>
      </section>

      {/* Каталог */}
      <section id="catalog" className="bg-gray-50 py-12">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-8 text-center text-2xl font-bold">Популярные товары</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PRODUCTS.map((product) => (
              <div
                key={product.id}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
              >
                <div className="flex h-40 items-center justify-center bg-gray-100 text-6xl">
                  {product.img}
                </div>
                <div className="p-4">
                  <h3 className="mb-2 font-medium text-gray-800">{product.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-amber-700">{product.price}</span>
                    <button className="rounded-lg bg-amber-600 px-3 py-1.5 text-sm text-white transition hover:bg-amber-700">
                      В корзину
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Секция промокода для авторизованных без инвайта */}
      {showPromoSection && (
        <section className="border-t border-gray-200 bg-white py-10">
          <div className="mx-auto max-w-md px-4">
            <h3 className="mb-2 text-center text-lg font-semibold text-gray-800">
              У вас есть промокод?
            </h3>
            <p className="mb-4 text-center text-sm text-gray-500">
              Введите промокод для получения специального предложения
            </p>
            <form onSubmit={handlePromoSubmit} className="flex gap-2">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Введите промокод"
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20"
              />
              <button
                type="submit"
                disabled={promoLoading || !promoCode.trim()}
                className="rounded-lg bg-amber-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-amber-700 disabled:opacity-50"
              >
                {promoLoading ? '...' : 'Применить'}
              </button>
            </form>
            {promoError && <p className="mt-3 text-center text-sm text-red-600">{promoError}</p>}
          </div>
        </section>
      )}

      {/* Футер */}
      <footer className="border-t border-gray-200 bg-gray-900 py-10 text-gray-400">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <span className="text-xl">🏠</span>
                <span className="font-bold text-white">МебельДом</span>
              </div>
              <p className="text-sm">
                Интернет-магазин мебели. Работаем с 2015 года. Более 50 000 довольных клиентов.
              </p>
            </div>
            <div>
              <h4 className="mb-3 font-semibold text-white">Контакты</h4>
              <p className="text-sm">+7 (495) 123-45-67</p>
              <p className="text-sm">info@mebeldom.example</p>
              <p className="text-sm">г. Москва, ул. Мебельная, д. 12</p>
            </div>
            <div>
              <h4 className="mb-3 font-semibold text-white">Информация</h4>
              <p className="text-sm">Пн-Пт: 9:00 — 21:00</p>
              <p className="text-sm">Сб-Вс: 10:00 — 19:00</p>
              <p className="text-sm">Самовывоз: ежедневно</p>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-700 pt-6 text-center text-xs text-gray-500">
            © 2015–2026 МебельДом. Все права защищены.
          </div>
        </div>
      </footer>
    </div>
  );
}
