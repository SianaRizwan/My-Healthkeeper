import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import "react-responsive-modal/styles.css";
import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "@material-ui/core";
import axios from "axios";
import { useSelector } from "react-redux";

const BpModal = ({ showBPModal,   setShowBPModal }) => {
  const token = useSelector((state) => state.token);
  const [chartData, setChartData] = useState({});

  const chart = () => {
    let sugar_array = [];
    let date_array = [];
    axios
      .get("http://localhost:5000/getChart/Bp", {
        headers: { Authorization: token },
      }) //get info and input date from db
      .then((res) => {

        res.data.infoData.forEach(element => {
            sugar_array.push(element);
        });
        res.data.dates.forEach(element=> {
            date_array.push(element);
        });
        console.log(date_array);

        setChartData({
          labels: date_array,
          datasets: [
            {
              data: sugar_array,
              label: "Blood Pressure (Last 7 days)",
              fill: false,
              lineTension: 0.5,
              backgroundColor: "rgba(75,192,192,1)",
              borderColor: "rgba(0,0,0,1)",
              borderWidth: 2,
            },
          ],
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    chart();
  }, []);

  const closeBPModal = () => {
    setShowBPModal(false);
  };

  return (
    <>
      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={showBPModal}
        onHide={closeBPModal}
      >
        <Modal.Header>
          <Modal.Title>
            <h4>Blood Pressure</h4>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h2>Graph</h2>

          <Line
            data={chartData}
            options={{
              responsive: true,
              title: { text: "Blood Pressure Graph", display: true },
              scales: {
                yAxes: [
                  {
                    ticks: {
                      autoSkip: true,
                      maxTicksLimit: 10,
                      beginAtZero: true,
                    },
                    gridLines: {
                      display: false,
                    },
                  },
                ],
                xAxes: [
                  {
                    gridLines: {
                      display: false,
                    },
                  },
                ],
              },
            }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              closeBPModal();
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};




export default BpModal;