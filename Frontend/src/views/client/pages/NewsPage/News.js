import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import newController from "../../../../controllers/NewController";
import tagController from "../../../../controllers/TagController";

const News = () => {
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
          <ul className="breadcrumb py-3 d-flex flex-wrap align-items-center">
            <li className="home">
              <Link
                className="link hover"
                to="/"
                title="Trang chủ"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                Trang chủ
              </Link>
              <span className="mx-1 md:mx-2 inline-block">&nbsp;/&nbsp;</span>
            </li>
            <li>
              <span className="text-secondary">Tin tức</span>
            </li>
          </ul>
        </div>
      </div>
      <section className="section main-page pb-5">
        <div className="container">
          <div className="row">
            <div className="col-9">
              <div className=" text-left">
                <h1 className="heading fw-semibold text-success">Tin tức</h1>
              </div>
              {/* Loading hoặc danh sách tin */}
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-success" role="status">
                    <span className="visually-hidden">Đang tải...</span>
                  </div>
                </div>
              ) : (
                <div className="article-list">
                  <div className="mt-2 row row-cols-lg-3">
                    {news.map((item, index) => (
                      <div className="col p-2" key={index}>
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
                          <div className="card-article__body p-3 d-flex flex-wrap flex-fill">
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
                            <div className="d-flex justify-content-between align-items-center pt-2  border-top border-neutral-50 flex-wrap w-100">
                              <div className="cart-article__date  fs-7  text-neutral-200 d-flex align-items-center whitespace-nowrap">
                                <i className="bi bi-calendar3 me-1"></i>
                                {new Date(item.publishedAt).toLocaleDateString(
                                  "vi-VN"
                                )}
                              </div>

                              <a
                                href={item.slug}
                                title="Xem chi tiết"
                                className="btn fw-semibold  text-danger border border-danger  whitespace-nowrap px-3 py-2 fs-7 rounded-5"
                              >
                                Xem chi tiết
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

            <div className="blog-sidebar col-3">
              <div className="bg-white mb-5 h-auto px-4 z-10 d-flex flex-column rounded">
                <aside className="aside-item blog-sidebar aside-item py-4">
                  <div className="aside-title">
                    <h2 className="title-head mt-0 fs-6 fw-semibold mb-3">
                      <span>DANH MỤC</span>
                    </h2>
                  </div>
                  <div className="aside-content">
                    <nav className="nav-category navbar-toggleable-md">
                      <ul className="p-0 ps-2 fs-6 fst-italic">
                        <li className="nav-item py-1">
                          <a
                            className="nav-link link text-hover"
                            href="/meo-hay"
                          >
                            Mẹo hay
                          </a>
                        </li>

                        <li className="nav-item py-1">
                          <a
                            className="nav-link link text-hover"
                            href="/mon-ngon"
                          >
                            Món ngon
                          </a>
                        </li>

                        <li className="nav-item py-1">
                          <a
                            className="nav-link link text-hover"
                            href="/meo-hay"
                          >
                            Tin tức
                          </a>
                        </li>

                        <li className="nav-item py-1">
                          <a
                            className="nav-link link text-hover"
                            href="/meo-hay"
                          >
                            Tin khuyến mãi
                          </a>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </aside>

                <aside className="blog-aside aside-item blog-aside-article aside-item py-4 border-top border-neutral-50">
                  <div className="aside-title">
                    <h2 className="title-head mt-0 fs-6 fw-semibold mb-3">
                      <span>
                        <a
                          className="link text-black text-decoration-none text-hover"
                          href="meo-hay"
                          title="TIN TỨC NỔI BẬT"
                        >
                          TIN TỨC NỔI BẬT
                        </a>
                      </span>
                    </h2>
                  </div>
                  <div className="aside-content-article aside-content mt-0">
                    <div className="blog-image-list space-y-3 ">
                      {news.slice(0, 3).map((item, index) => (
                        <div className="card-article-media d-flex gap-2 my-2">
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
              <div className="bg-white mt-5 h-auto px-4 z-10 d-flex flex-column rounded">
                <aside className="blog-aside aside-item blog-aside-article aside-item py-4 border-top border-neutral-50">
                  <div className="aside-title">
                    <h2 className="title-head mt-0 fs-6 fw-semibold mb-3">
                      Tags
                    </h2>
                  </div>
                  <div className="aside-content-article aside-content mt-3 ">
                    <div className="blog-tag-list d-flex flex-wrap">
                      {tagsNew.map((tag, index) => (
                        <a
                          key={index}
                          className="border px-3 py-1 rounded border-danger text-danger text-decoration-none m-1 fs-7"
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
