import SideNavbar from "../SideNavbar";
import "./Information.css";

const Information = () => {
  return (
    <div className="information-container">
      {" "}
      <SideNavbar />
      <div className="information-optioins-container">
        <link
          href="https://fonts.googleapis.com/css?family=Roboto:100,400,300,500,700"
          rel="stylesheet"
          type="text/css"
        />
        <div className="text-icons-container">
          <div align="center" className="fond">
            <div
              className="carre_couleur base_hov"
              style={{ backgroundColor: "#2ecc71" }}
            >
              <div
                className="retract"
                style={{ backgroundColor: "#2ecc71", width: "100%" }}
              >
                <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/173024/photo.png" />
              </div>
              <div className="acced">
                <div className="big_acced">
                  Scanati bonul sau adaugati manual produsele
                </div>
                <div className="middle_acced"></div>
              </div>
            </div>
            <div
              className="carre_couleur base_hov"
              style={{ backgroundColor: "#f8b334" }}
            >
              <div
                className="retract"
                style={{ backgroundColor: "#f8b334", width: "100%" }}
              >
                <img src="https://d1.awsstatic.com/Test%20Images/Kate%20Test%20Images/simple-monthly-calculator.a5b32fa2accee1b0b82d3b51215ad90911d840b5.png" />
              </div>
              <div className="acced">
                <div className="middle_acced">
                  Primiti statistici ale achizitiilor
                </div>
              </div>
            </div>
            <div
              className="carre_couleur base_hov"
              style={{ backgroundColor: "#e74c3c" }}
            >
              <div
                className="retract"
                style={{ backgroundColor: "#e74c3c", width: "100%" }}
              >
                <img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/173024/ordi.png" />
              </div>
              <div className="acced">
                <div className="middle_acced">
                  Tineti pasul cu achizitiile zilnic
                </div>
              </div>
            </div>

            <div className="text">
              Aplicatie financiara pentru gestiunea cheltuielilor. <br />
              <br></br>
              <font style={{ fontWeight: "400" }}>ELPASO.ZAPTO.ORG</font>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Information;
