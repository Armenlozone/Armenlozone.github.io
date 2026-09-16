export default function About() {
  return (
    <section>
      <h1><center>About</center></h1>
      <p>
        <center>
          Hello, I go by Armen Lozone. Welcome to my website!<br />
          I have a special interest in military vehicles and their development.<br /> 
          As such, this site is dedicated to exploring the <strong>history and evolution of military technology</strong>.<br /> 
          Especially when it comes to <strong>prototypes</strong> and <strong>experimental designs</strong>, be they aircraft, ground or naval vehicles.
        </center>
      </p>
      <br />
      <h2><center>Scope of this Site</center></h2>
      <p>
        <center>
          This site is WIP, but I am constantly adding new content and plan to keep doing so as long as my resources allow.<br />
          The main focus of this site is to explore niche, interesting and/or otherwise unknown <strong>military vehicles</strong> and their <strong>development</strong>.<br />
          I will be adding more articles and information on various topics related to military technology.<br />
          A secondary interest will be uploading images of <strong>3D models</strong> of vehicles that i have designed/created either from scratch or based on existing designs.<br />
          If you have any suggestions or feedback, please feel free to contact me.
        </center>
      </p>
      <br />
      <h2 style={{ textAlign: "center" }}>Contact</h2>

      <div style={{ textAlign: "center" }}>
          <p>
              You can reach me at:{" "}
              <a href="mailto:armenlozone@gmail.com">
                  armenlozone@gmail.com
              </a>
              <br />

              Or reach me on discord:{" "}
              <a href="https://discord.gg/9kqgRV3Typ">
                  <i
                      className="fa-brands fa-discord w3-hover-opacity icons"
                      aria-hidden="true"
                  />
                  Armen's Neocities
              </a>
              <br />

              I am also active on various social media platforms, such as{" "}
              <a
                  href="https://x.com/armenlozone"
                  target="_blank"
                  rel="noopener noreferrer"
              >
                  <i
                      className="fa-brands fa-x-twitter"
                      aria-hidden="true"
                  />
                  Armen Lozone
              </a>
              <br />

              so feel free to reach out to me there as well.
          </p>
      </div>

      <br />

      <h2 style={{ textAlign: "center" }}>Credits to external sources</h2>

      <div style={{ textAlign: "center" }}>
          <p>
              I would like to give credit to the following sources for their
              contributions to this site:
          </p>

          <ul style={{ display: "inline-block", textAlign: "left" }}>
              <li>
                <a href="https://www.flaticon.com/free-icons/missile" title="missile icons">Missile icon by photo3idea_studio</a>
              </li>
              <li>
                <a href="https://wiki.warthunder.com" title="vehicle icons">Vehicle icons by War Thunder Wiki</a>
              </li>
              <li>
                <a href="https://www.flaticon.com/free-icons/password" title="password icons">Lock icon by Prosymbols Premium</a>
              </li>
          </ul>
      </div>
    </section>
  );
}
