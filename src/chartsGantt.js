import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import GanttCharts from "./components/GanttCharts";
import { Container } from "react-bootstrap";
import PageLayout from "./components/Layout";

function chartsGantt() {
  return (
    <PageLayout>
      <Container className="data-table table-responsive">
        <GanttCharts />
      </Container>
    </PageLayout>
  );
}
export default chartsGantt;
