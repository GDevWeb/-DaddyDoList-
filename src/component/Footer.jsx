import "../sass/footer.scss";
function Footer() {
  return (
    <footer>
      <div id="copyright">©{new Date().getFullYear()} GDevWeb</div>
      <div id="links">
        <a href="https://www.linkedin.com/in/ga%C3%ABtan-dammaretz/">
          Linkedin
        </a>
        <a href="https://github.com/GDevWeb">Github</a>
      </div>
    </footer>
  );
}

export default Footer;
