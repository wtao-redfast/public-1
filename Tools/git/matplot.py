import matplotlib
import matplotlib.pyplot as plt
import numpy as np

BAR_WIDTH = 0.3

def plotSinglebar(axis, xValues, yValues, xOffset = 0, title = "", xLabel = "", yLabel = ""):
    x = np.arange(len(xValues))  
    barChart = axis.bar(x + xOffset, yValues, BAR_WIDTH, label = xLabel)
    if yLabel:
        axis.set_ylabel(yLabel)
    if title:
        axis.set_title(title)
    axis.set_xticks(x)
    axis.set_xticklabels(xValues)
    for bar in barChart:
        height = bar.get_height()
        axis.annotate('{}'.format(height),
                        xy = (bar.get_x() + bar.get_width() / 2, height),
                        xytext = (0, 3),
                        textcoords = "offset points",
                        ha = 'center', va = 'bottom')


def plotMultibar(axis, xValues, values2D, values2DLabels, title = "", yLabel = ""):
    xOffset = len(values2D) / -2.0 * BAR_WIDTH + BAR_WIDTH / 2
    for index in range(len(values2D)):
        plotSinglebar(axis, xValues, values2D[index], xOffset = xOffset, xLabel = values2DLabels[index])
        xOffset += BAR_WIDTH
    axis.set_ylabel(yLabel)
    axis.set_title(title)
    axis.legend()

