import "./App.css";
import { useState, useRef, useEffect, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const projects = {
  mk: {
    key: "mk",
    navLogo: "assets/2_logo_mk.png",
    navLogoStyle: { filter: "invert(1)" },
    navBg: "#ffd323",
    summaryLogo: "/assets/2_mk.png",
    slideCount: 13,
    slideFolder: "mk",
    tags: ["Capstone Project", "Flutter", "Node.js", "MySQL"],
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
    repoUrl: "#",
    imageStyle: { maxHeight: "auto", width: "30%", marginBottom: "5%" },
    logoStyle: { height: "120%" },
  },
  sc: {
    key: "sc",
    navLogo: "assets/2_logo_sc.png",
    navLogoStyle: { filter: "invert(1)" },
    navBg: "#ffd323",
    summaryLogo: "/assets/2_sc.png",
    slideCount: 9,
    slideFolder: "sc",
    tags: ["ASP.NET", "Angular", "MySQL"],
    description:
      "ServiceConnect is a platform that bridges service providers and clients, making it easy to find, book, and review local services in your area.",
    repoUrl: "#",
    imageStyle: { maxHeight: "65%", width: "auto", marginBottom: "5%" },
    logoStyle: { height: "110%", paddingTop: "5%" },
  },
  ss: {
    key: "ss",
    navLogo: "assets/2_logo_ss.png",
    navLogoStyle: { filter: "invert(1)" },
    navBg: "#ffd323",
    summaryLogo: "/assets/2_ss.png",
    slideCount: 12,
    slideFolder: "ss",
    tags: ["ReactJS", "Firebase"],
    description:
      "Seeds & Scholars is a scholarship management system designed to streamline application, tracking, and disbursement for academic institutions.",
    repoUrl: "https://github.com/Kombuucha/Seeds-and-Scholars",
    imageStyle: { maxHeight: "65%", width: "auto", marginBottom: "5%" },
    logoStyle: { height: "110%", paddingTop: "5%" },
  },
  pd: {
    key: "pd",
    navLogo: "assets/2_logo_pd.png",
    navLogoStyle: { filter: "invert(1)" },
    navBg: "#ffd323",
    summaryLogo: "/assets/2_pd.png",
    slideCount: 15,
    slideFolder: "pd",
    tags: ["Laravel"],
    description:
      "Pundar is a community-driven Q&A app that connects students with peers and mentors to get answers to academic and career-related questions.",
    repoUrl: "https://github.com/pelopeno/OFW-App",
    imageStyle: { maxHeight: "75%", width: "auto", marginBottom: "5%" },
    logoStyle: { height: "100%", paddingTop: "5%" },
  },
  ml: {
    key: "ml",
    navLogo: "assets/2_logo_ml.png",
    navLogoStyle: { filter: "invert(1)" },
    navBg: "#ffd323",
    summaryLogo: "/assets/2_ml.png",
    slideCount: 6,
    slideFolder: "ml",
    tags: ["Flutter", "Firebase"],
    description:
      "Memory Lane is a personal journaling app that lets users document moments with photos, mood tags, and timelines — building a visual diary over time.",
    repoUrl: "https://github.com/Kombuucha/memory_lane/",
    imageStyle: { maxHeight: "auto", width: "30%", marginBottom: "5%" },
    logoStyle: { height: "110%", paddingTop: "2%" },
  },
};

const projectOrder = ["mk", "sc", "ss", "pd", "ml"];

function Lightbox({ src, onClose }) {
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <button className="lightbox-close" onClick={onClose} aria-label="Close">
        ✕
      </button>
      <img
        src={src}
        className="lightbox-img"
        onClick={(e) => e.stopPropagation()}
        alt="Enlarged screenshot"
      />
    </div>
  );
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function animateScrollTo(container, targetY, duration = 800) {
  const startY = container.scrollTop;
  const distance = targetY - startY;
  const startTime = performance.now();

  function step(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    container.scrollTop = startY + distance * easeInOutCubic(progress);
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

function App() {
  const [selectedProject, setSelectedProject] = useState("mk");
  const [lightboxSrc, setLightboxSrc] = useState(null);

  const mainRef = useRef(null);
  const introRef = useRef(null);
  const projectsRef = useRef(null);
  const contactRef = useRef(null);
  const isScrolling = useRef(false);

  // Programmatic smooth scroll used by nav links
  const scrollToSection = useCallback((ref) => {
    const container = mainRef.current;
    if (!container || !ref.current) return;
    animateScrollTo(container, ref.current.offsetTop);
  }, []);

  const scrollToProjects = useCallback(() => scrollToSection(projectsRef), [scrollToSection]);
  const scrollToContact  = useCallback(() => scrollToSection(contactRef),  [scrollToSection]);

  // Desktop-only: intercept wheel + keyboard to snap between sections smoothly
  useEffect(() => {
    const container = mainRef.current;
    if (!container) return;

    const isMobile = () => window.innerWidth <= 900;
    const sections = [introRef, projectsRef, contactRef];

    function getNearestSectionIndex() {
      const scrollY = container.scrollTop;
      let closest = 0;
      let minDist = Infinity;
      sections.forEach((ref, i) => {
        if (!ref.current) return;
        const dist = Math.abs(ref.current.offsetTop - scrollY);
        if (dist < minDist) { minDist = dist; closest = i; }
      });
      return closest;
    }

    function goToSection(index) {
      const clamped = Math.max(0, Math.min(index, sections.length - 1));
      const target = sections[clamped].current;
      if (!target) return;
      isScrolling.current = true;
      animateScrollTo(container, target.offsetTop, 800);
      setTimeout(() => { isScrolling.current = false; }, 900);
    }

    function handleWheel(e) {
      if (isMobile()) return;
      e.preventDefault();
      if (isScrolling.current) return;
      const current = getNearestSectionIndex();
      goToSection(e.deltaY > 0 ? current + 1 : current - 1);
    }

    function handleKeyDown(e) {
      if (isMobile()) return;
      const keys = ["ArrowDown", "ArrowUp", "PageDown", "PageUp", " "];
      if (!keys.includes(e.key)) return;
      if (e.target !== document.body && e.target !== container) return;
      e.preventDefault();
      if (isScrolling.current) return;
      const current = getNearestSectionIndex();
      const down = ["ArrowDown", "PageDown", " "].includes(e.key);
      goToSection(down ? current + 1 : current - 1);
    }

    container.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      container.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const active = projects[selectedProject];

  return (
    <main ref={mainRef}>
      {lightboxSrc && (
        <Lightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />
      )}

      <section className="intro" ref={introRef}>
        <nav>
          <p onClick={scrollToProjects} style={{ cursor: "pointer" }}>Projects</p>
          <p onClick={scrollToContact} style={{ cursor: "pointer" }}>Contact</p>
        </nav>
        <img src="assets/1_doodle_bkg.png" className="doodleBkg" />
        <img src="assets/1_doodle.png" className="doodle" />
        <div className="introText">
          <h1>
            DARYL
            <br />
            DOCTORA
          </h1>

          <h2>Daryl Christien Doctora</h2>

          <p style={{ marginTop: "2.5%" }}>Web and Mobile Dev Major</p>
          <br />
          <p>from UST</p>
        </div>
      </section>

      <section className="projects" ref={projectsRef}>
        <nav>
          <p>// PROJECTS</p>
        </nav>
        <div className="projectsMain">
          <div className="projectsWindow">
            <div className="projectsNav">
              {projectOrder.map((key) => {
                const proj = projects[key];
                const isActive = selectedProject === key;
                return (
                  <div
                    key={key}
                    className={`projNavItem ${key}${isActive ? " projNavItem--active" : ""}`}
                    style={{
                      backgroundColor: isActive ? proj.navBg : "#303030",
                    }}
                    onClick={() => setSelectedProject(key)}
                  >
                    <img
                      src={proj.navLogo}
                      style={isActive ? proj.navLogoStyle : {}}
                    />
                  </div>
                );
              })}
            </div>

            <div className="projectsOverview">
              <div className="projectsImage">
                <img
                  src="/assets/2_projects_doodle.png"
                  className="projectsDoodle"
                />
                <Swiper
                  key={selectedProject}
                  modules={[Navigation, Pagination]}
                  spaceBetween={900}
                  navigation
                  pagination={{ clickable: true }}
                  slidesPerView={1}
                  loop={true}
                  centeredSlides={true}
                >
                  {Array.from({ length: active.slideCount }, (_, i) => {
                    const imgSrc = `/assets/${active.slideFolder}/${String(i + 1).padStart(2, "0")}.png`;
                    return (
                      <SwiperSlide key={i}>
                        <img
                          src={imgSrc}
                          alt={`Screenshot ${i + 1}`}
                          className="slide-img"
                          style={{ ...active.imageStyle, cursor: "zoom-in" }}
                          onClick={() => setLightboxSrc(imgSrc)}
                        />
                      </SwiperSlide>
                    );
                  })}
                </Swiper>
              </div>

              <div className="projectsSummary">
                <div className="projectsSummaryLogo">
                  <img src={active.summaryLogo} style={active.logoStyle} />
                </div>

                <div className="projectsSummaryDesc">
                  <div className="projTags">
                    {active.tags.map((tag) => (
                      <p key={tag} className="projTag">
                        {tag}
                      </p>
                    ))}
                  </div>

                  <p className="projDesc">{active.description}</p>

                  <a href={active.repoUrl}>
                    <div className="repoBtn">
                      <p>Go to Repo</p>
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        stroke="#ffffff"
                      >
                        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                        <g
                          id="SVGRepo_tracerCarrier"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></g>
                        <g id="SVGRepo_iconCarrier">
                          <path
                            d="M5.5 5L11.7929 11.2929C12.1834 11.6834 12.1834 12.3166 11.7929 12.7071L5.5 19"
                            stroke="ffffff"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          ></path>
                          <path
                            d="M13.5 5L19.7929 11.2929C20.1834 11.6834 20.1834 12.3166 19.7929 12.7071L13.5 19"
                            stroke="ffffff"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          ></path>
                        </g>
                      </svg>
                    </div>
                  </a>
                </div>
                <div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="contact" ref={contactRef}>
        <img src="assets/3_doodle_bkg.png" />
        <div className="contactBig">
          <p>
            The best ideas rarely happen in isolation. <br />They begin with
            conversations, collaboration, and the courage to reach out.<br /> Whether
            you have a project in mind, an opportunity to share, or simply want
            to connect, I'd be glad to hear from you.
          </p>
          <h1>CONTACT</h1>
        </div>
        <div className="contactDeets">
          <h2>dardoctora@gmail.com</h2>
          <h3>email</h3>
          <h2>+63 977 406 9840</h2>
          <h3>phone number</h3>
          <h2>
            <a href="https://www.linkedin.com/in/daryl-doctora/">
              www.linkedin.com/in/daryl-doctora/
            </a>
          </h2>
          <h3>linkedin</h3>
        </div>
      </section>
    </main>
  );
}

export default App;