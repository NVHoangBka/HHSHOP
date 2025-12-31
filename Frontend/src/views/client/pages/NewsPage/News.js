import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import newController from "../../../../controllers/NewController";
import tagController from "../../../../controllers/TagController";
import { useTranslation } from "react-i18next";

const News = () => {
  const { t } = useTranslation();
  const [news, setNews] = useState([]);
  const [tagsNew, setTagsNew] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const result = await newController.getNews();
      if (result.success) {
        setNews(result.news || []); // Đảm bảo luôn là array
      }
    } catch (error) {
      console.error("Lỗi fetch tin tức:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTags = async () => {
    try {
      setLoading(true);
      const result = await tagController.getAllTags();
      if (result.success) {
        setTagsNew(result.tags || []); // Đảm bảo luôn là array
      }
    } catch (error) {
      console.error("Lỗi fetch tags:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
    fetchTags();
  }, []);

  return (
    <div className="bg-success-subtle">
      <div className="breadcrumbs">
        <div className="container">
          <ul className="breadcrumb py-xl-3 d-flex flex-wrap align-items-center">
            <li className="home">
              <Link
                className="link hover"
                to="/"
                title={t("news.breadcrumb.home")}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                {t("news.breadcrumb.home")}
              </Link>
              <span className="mx-xl-1 inline-block">&nbsp;/&nbsp;</span>
            </li>
            <li>
              <span className="text-secondary">
                {t("news.breadcrumb.current")}
              </span>
            </li>
          </ul>
        </div>
      </div>
      <section className="section main-page pb-xl-5">
        <div className="container">
          <div className="row">
            <div className="col-xl-9">
              <div className=" text-left">
                <h1 className="heading fw-semibold text-success">
                  {t("news.heading")}
                </h1>
              </div>
              {/* Loading hoặc danh sách tin */}
              {loading ? (
                <div className="text-center py-xl-5">
                  <div className="spinner-border text-success" role="status">
                    <span className="visually-hidden">{t("news.loading")}</span>
                  </div>
                </div>
              ) : news.length === 0 ? (
                <div className="text-center py-xl-5 text-muted">
                  {t("news.noArticles")}
                </div>
              ) : (
                <div className="article-list">
                  <div className="mt-xl-2 row row-cols-lg-3">
                    {news.map((item, index) => (
                      <div className="col p-xl-2" key={index}>
                        <div className="card-article bg-white rounded group h-100 d-flex flex-column ">
                          <div className="card-article__image aspect-video d-flexjustify-content-center overflow-hidden rounded-top">
                            <a href={`/${item.slug}`} title={item.title}>
                              <img
                                loading="lazy"
                                className="aspect-video object-contain transition-transform duration-300"
                                src={item.thumbnail}
                                alt={item.title}
                                width="331"
                                height="186"
                              />
                            </a>
                          </div>
                          <div className="card-article__body p-xl-3 d-flex flex-wrap flex-fill">
                            <div className="d-flex flex-column justify-content-between">
                              <p
                                className="card-article__title fw-semibold m-0 line-clamp-2 "
                                style={{ height: "48px" }}
                              >
                                <a
                                  href={item.slug}
                                  title={item.title}
                                  className="link break-word text-black text-decoration-none text-hover "
                                >
                                  {item.title}
                                </a>
                              </p>
                              <p className="card-article__desc break-word text-secondary fs-7 line-clamp-3 mt-1">
                                {item.description}
                              </p>
                            </div>
                            <div className="d-flex justify-content-between align-items-center pt-xl-2  border-top border-neutral-50 flex-wrap w-100">
                              <div className="cart-article__date  fs-7  text-neutral-200 d-flex align-items-center whitespace-nowrap">
                                <i className="bi bi-calendar3 me-1"></i>
                                {new Date(item.publishedAt).toLocaleDateString(
                                  "vi-VN"
                                )}
                              </div>

                              <a
                                href={item.slug}
                                title={t("news.readMore")}
                                className="btn fw-semibold  text-danger border border-danger  whitespace-nowrap px-xl-3 py-xl-2 fs-7 rounded-5"
                              >
                                {t("news.readMore")}
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="blog-sidebar col-xl-3">
              <div className="bg-white mb-xl-5 h-auto px-xl-4 z-10 d-flex flex-column rounded">
                <aside className="aside-item blog-sidebar aside-item py-xl-4">
                  <div className="aside-title">
                    <h2 className="title-head mt-0 fs-6 fw-semibold mb-xl-3">
                      {t("news.sidebar.categories.title")}
                    </h2>
                  </div>
                  <div className="aside-content">
                    <nav className="nav-category navbar-toggleable-md">
                      <ul className="p-0 ps-xl-2 fs-6 fst-italic">
                        <li className="nav-item py-1">
                          <a
                            className="nav-link link text-hover"
                            href="/meo-hay"
                          >
                            {t("news.sidebar.categories.tips")}
                          </a>
                        </li>

                        <li className="nav-item py-1">
                          <a
                            className="nav-link link text-hover"
                            href="/mon-ngon"
                          >
                            {t("news.sidebar.categories.recipes")}
                          </a>
                        </li>

                        <li className="nav-item py-1">
                          <a
                            className="nav-link link text-hover"
                            href="/meo-hay"
                          >
                            {t("news.sidebar.categories.news")}{" "}
                          </a>
                        </li>

                        <li className="nav-item py-1">
                          <a
                            className="nav-link link text-hover"
                            href="/meo-hay"
                          >
                            {t("news.sidebar.categories.promotions")}
                          </a>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </aside>

                <aside className="blog-aside aside-item blog-aside-article aside-item py-xl-4 border-top border-neutral-50">
                  <div className="aside-title">
                    <h2 className="title-head mt-0 fs-6 fw-semibold mb-xl-3">
                      <span>
                        <a
                          className="link text-black text-decoration-none text-hover"
                          href="meo-hay"
                          title={t("news.sidebar.featured.title")}
                        >
                          {t("news.sidebar.featured.title")}
                        </a>
                      </span>
                    </h2>
                  </div>
                  <div className="aside-content-article aside-content mt-0">
                    <div className="blog-image-list space-y-3 ">
                      {news.slice(0, 3).map((item, index) => (
                        <div className="card-article-media d-flex gap-2 my-xl-2">
                          <div className="card-article__image d-flex-shrink-0 flex-grow-0">
                            <a
                              className="link line-clamp-2 break-words"
                              href={`/${item.slug}`}
                              title={item.title}
                            >
                              <img
                                loading="lazy"
                                className="aspect-video object-contain group-hover:scale-105 transition-transform duration-300"
                                src={item.thumbnail}
                                alt={item.title}
                                width="107"
                                height="80"
                              />
                            </a>
                          </div>
                          <div className="card-article__body">
                            <p className="card-article__title fw-semibold">
                              <a
                                className="link line-clamp-2 break-word text-black fs-7 text-decoration-none text-hover"
                                href={`/${item.slug}`}
                                title={item.title}
                              >
                                {item.title}
                              </a>
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </aside>
              </div>
              <div className="bg-white mt-xl-5 h-auto px-xl-4 z-10 d-flex flex-column rounded">
                <aside className="blog-aside aside-item blog-aside-article aside-item py-xl-4 border-top border-neutral-50">
                  <div className="aside-title">
                    <h2 className="title-head mt-0 fs-6 fw-semibold mb-xl-3">
                      {t("news.sidebar.tags")}
                    </h2>
                  </div>
                  <div className="aside-content-article aside-content mt-xl-3">
                    <div className="blog-tag-list d-flex flex-wrap">
                      {tagsNew.map((tag, index) => (
                        <a
                          key={index}
                          className="border px-xl-3 py-1 rounded border-danger text-danger text-decoration-none m-1 fs-7"
                          href={`/blogs/all/tagged/${tag.slug}`}
                          title={tag.name}
                        >
                          {tag.name}
                        </a>
                      ))}
                    </div>
                  </div>
                </aside>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default News;
