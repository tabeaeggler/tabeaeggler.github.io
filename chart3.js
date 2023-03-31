import { drawHeatMap } from "./heatmap.js";

drawHeatMap("./data/data_q3_all.csv", "#chart4_0", "true", "all londoners");
d3.select('#dropdown').on('change', function() {

    // remove all previous heatmaps
    d3.selectAll(".heatmap-container-svg").remove();

    var selected = d3.select(this).property('value');
    if (selected === '1') {
        d3.selectAll(".tooltip-heatmap").remove();
        drawHeatMap("./data/data_q3_all.csv", "#chart4_0", "true", "all londoners");
        drawHeatMap("./data/data_q3_age_18_24.csv", "#chart4_1", "false", "18-24 years");
        drawHeatMap("./data/data_q3_age_25_34.csv", "#chart4_2", "false", "25-34 years");
        drawHeatMap("./data/data_q3_age_35_49.csv", "#chart4_3", "false", "35-49 years");
        drawHeatMap("./data/data_q3_age_50_64.csv", "#chart4_4", "false", "50-64 years");
        drawHeatMap("./data/data_q3_age_65_plus.csv", "#chart4_5", "false", "64+ years");
    }
    else if (selected === '2') {
        d3.selectAll(".tooltip-heatmap").remove();
        drawHeatMap("./data/data_q3_all.csv", "#chart4_0", "true", "all londoners");
        drawHeatMap("./data/data_q3_employ_fulltime.csv", "#chart4_1", "false", "full-time");
        drawHeatMap("./data/data_q3_employ_parttime.csv", "#chart4_2", "false", "part-time");
        drawHeatMap("./data/data_q3_employ_student.csv", "#chart4_3", "false", "student");
        drawHeatMap("./data/data_q3_employ_retired.csv", "#chart4_4", "false", "retired");
        drawHeatMap("./data/data_q3_employ_unemployed.csv", "#chart4_5", "false", "unemployed");
    }
    else if (selected === '3') {
        d3.selectAll(".tooltip-heatmap").remove();
        drawHeatMap("./data/data_q3_all.csv", "#chart4_0", "true", "all londoners");
        drawHeatMap("./data/data_q3_ethnicity_black.csv", "#chart4_1", "false", "black");
        drawHeatMap("./data/data_q3_ethnicity_white.csv", "#chart4_2", "false", "white");
        drawHeatMap("./data/data_q3_ethnicity_asian.csv", "#chart4_3", "false", "asian");
        drawHeatMap("./data/data_q3_ethnicity_other.csv", "#chart4_4", "false", "other");
    }
});
