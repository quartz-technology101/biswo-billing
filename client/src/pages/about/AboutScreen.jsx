import React from "react";
import PageTitle from "../../components/Common/PageTitle";

function AboutScreen() {
  return (
    <div>
      <div className="p-4">
        <div className="bg-white rounded-xl p-3 font-title">
          <PageTitle title="About Me" />
          <div className="mt-4 mb-5 flex flex-row items-center">
            <img
              src="https://avatars.githubusercontent.com/u/85009048?v=4"
              className="h-12 mr-3"
              alt="Git"
            />
            <div>
              <a
                href="https://www.linkedin.com/in/dilip-dawadi-0ab68722b/"
                target={"_blank"}
                className="underline cursor-pointer"
                rel="noreferrer"
              >
                Hi, I'm Dilip Dawadi
              </a>
              <h1> Full Stack Developer</h1>
            </div>
          </div>

          <PageTitle title="Billing Management System" />
          <div className="mt-2 pl-4 text-sm">
            <ul class="list-disc">
              <li> Can Easily Pre-Manage Your Products</li>
              <li> Can Easily Pre-Manage Your Clients</li>
              <li> Can Export PDF </li>
              <li> Can Export Image </li>
            </ul>
          </div>
          <div className="font-title mt-3 mb-5">
            <div>
              📫 How to reach me{" "}
              <a
                href="mailto:zanzerdawadi123@gmail.com"
                className="underline cursor-pointer"
              >
                zanzerdawadi123@gmail.com
              </a>{" "}
              (or){" "}
              <a
                href="https://www.facebook.com/dilip.dawadi.7"
                target={"_blank"}
                className="underline cursor-pointer"
                rel="noreferrer"
              >
                facebook
              </a>
            </div>
            <div>
              <span>✅ </span>
              <a
                href="h"
                className="underline cursor-pointer"
                target={"_blank"}
                rel="noreferrer"
              >
                {" "}
                Repo Link Here
              </a>
            </div>
          </div>

          <PageTitle title="Build By" />
          <div className="mt-2 mb-5 pl-4 text-sm">
            <ul class="list-disc">
              <li> Framer Motion For each component Animation</li>
              <li> Lottiefiles For Dashboard Widgets Icons</li>
              <li> Redux For State Management</li>
              <li> ReactJS </li>
            </ul>
          </div>

          <PageTitle title="Contact" />
          <div className="mt-2 pl-1 text-sm">
            <a
              href="tel:+9779810024561"
              className="underline cursor-pointer"
              target={"_blank"}
              rel="noreferrer"
            >
              {" "}
              +9779810024561
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
export default AboutScreen;
