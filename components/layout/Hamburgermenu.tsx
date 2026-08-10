"use client";

import { useState } from "react";
import { createPortal } from "react-dom";

const GALLERY = [
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
  "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f",
  "https://images.unsplash.com/photo-1552566626-52f8b828add9",
  "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe",
  "https://images.unsplash.com/photo-1512621776951-a57141f2eefd",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
];

export default function HamburgerMenu() {
  const [open, setOpen] = useState(false);

  const panel = (
    <>
      <style>{`
        .hb-trigger {
          width: 46px;
          height: 46px;
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 5px;
          background: #101012;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          position: relative;
          z-index: 1001;
        }

        .hb-trigger span {
          width: 22px;
          height: 2px;
          background: #fff;
          transition: transform .3s ease, opacity .3s ease;
        }

        .hb-trigger.active span:nth-child(1) {
          transform: translateY(7px) rotate(45deg);
        }

        .hb-trigger.active span:nth-child(2) {
          opacity: 0;
        }

        .hb-trigger.active span:nth-child(3) {
          transform: translateY(-7px) rotate(-45deg);
        }

        .hb-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,.6);
          opacity: 0;
          visibility: hidden;
          transition: opacity .35s ease;
          z-index: 999998;
          pointer-events: none;
        }

        .hb-overlay.show {
          opacity: 1;
          visibility: visible;
          pointer-events: auto;
        }

        .hb-panel {
          position: fixed;
          top: 0;
          right: 0;
          height: 100%;
          width: 380px;
          max-width: 90vw;
          padding: 60px 36px 40px;
          overflow-y: auto;
          background: linear-gradient(
            160deg,
            #16171b 0%,
            #0a0a0c 60%,
            #000 100%
          );
          color: #fff;
          transform: translateX(100%);
          transition: transform .4s cubic-bezier(.65,0,.35,1);
          z-index: 999999;
        }

        .hb-panel.open {
          transform: translateX(0);
        }

        .hb-close {
          position: absolute;
          top: 20px;
          left: -46px;
          width: 46px;
          height: 46px;
          background: #2563eb;
          color: #fff;
          border: none;
          font-size: 16px;
          cursor: pointer;
        }

        .hb-logo {
          font-size: 26px;
          font-weight: 700;
          margin-bottom: 16px;
        }

        .hb-logo span {
          color: #2563eb;
        }

        .hb-about {
          font-size: 14px;
          line-height: 1.7;
          color: #b9b9c0;
          margin-bottom: 24px;
        }

        .hb-gallery {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          margin-bottom: 28px;
        }

        .hb-gallery-item {
          aspect-ratio: 1 / 1;
          overflow: hidden;
          border-radius: 4px;
        }

        .hb-gallery-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .hb-heading {
          font-size: 18px;
          margin-bottom: 14px;
        }

        .hb-contact {
          list-style: none;
          padding: 0;
          margin: 0 0 26px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          font-size: 14px;
          color: #d5d5da;
        }

        .hb-contact .hb-icon {
          margin-right: 8px;
        }

        .hb-social {
          display: flex;
          gap: 10px;
        }

        .hb-social a {
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #333;
          border-radius: 4px;
          color: #fff;
          text-decoration: none;
          font-size: 13px;
        }

        .hb-social a:hover {
          background: #2563eb;
          border-color: #2563eb;
        }
      `}</style>

      <div
        className={`hb-overlay${open ? " show" : ""}`}
        onClick={() => setOpen(false)}
      />

      <aside className={`hb-panel${open ? " open" : ""}`}>
        <button
          className="hb-close"
          onClick={() => setOpen(false)}
          aria-label="Close menu"
        >
          ✕
        </button>

        <div className="hb-logo">
          <span>N</span>erio
        </div>

        <p className="hb-about">
          We love to bring to life as a developer and I aim the today do
          this using whatever front end tools of the necessary.
        </p>

        <div className="hb-gallery">
          {GALLERY.map((src, i) => (
            <div key={i} className="hb-gallery-item">
              <img src={src} alt="" />
            </div>
          ))}
        </div>

        <h4 className="hb-heading">Quick Contact:</h4>

        <ul className="hb-contact">
          <li>
            <span className="hb-icon">📞</span> +81112522552
          </li>
          <li>
            <span className="hb-icon">✉️</span> info@nerio.com
          </li>
          <li>
            <span className="hb-icon">📍</span> Ta-134/A, NY 11110, USA
          </li>
        </ul>

        <div className="hb-social">
          <a href="#" aria-label="Facebook">f</a>
          <a href="#" aria-label="Instagram">ig</a>
          <a href="#" aria-label="Pinterest">p</a>
          <a href="#" aria-label="X">x</a>
        </div>
      </aside>
    </>
  );

  return (
    <>
      <button
        className={`hb-trigger${open ? " active" : ""}`}
        onClick={() => setOpen(true)}
        aria-label="Open menu"
      >
        <span />
        <span />
        <span />
      </button>

      {typeof document !== "undefined" &&
        createPortal(panel, document.body)}
    </>
  );
}