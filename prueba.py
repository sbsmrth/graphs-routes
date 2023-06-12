from matplotlib import pyplot as plt
import networkx as nx
import matplotlib.pyplot as plt
import eel
from src.controllers.csv_controller import FileCSV
from src.controllers.utils_controller import Utils
from src.graphs.graph import GraphClass

def set_routes():
    routes_csv = FileCSV.read_csv('routes.csv', ',')
    routes = Utils.load_routes(routes_csv)

    return [routes_csv, routes]

def set_airports():
    airports_csv = FileCSV.read_csv('airports.csv', ',')
    airports = Utils.load_airports(airports_csv)

    return [airports_csv, airports]

all_routes = set_routes()
routes_csv = all_routes[0]
routes = all_routes[1]

all_airports = set_airports()
airports_csv = all_airports[0]
airports = all_airports[1]

from matplotlib import pyplot as plt
import networkx as nx


class GraphClass:
    def __init__(self):
        self.G = nx.Graph()
        self.pos = None
        self.node_selected = None

    def add_edge(self, u, v, w):
        self.G.add_edge(u, v, weight=w)

    def dijkstra(self, origen, destino):
        shortest_path = nx.dijkstra_path(self.G, origen, destino)
        self.node_colors = {origen: "#FF8400", destino: "#FF8400"}
        return shortest_path

    def complete_graph(self):
        self.pos = nx.layout.planar_layout(self.G)
        fig_complete = plt.figure(figsize=(6, 6), facecolor="#F5EFE7")
        self.redraw(fig_complete)

        fig_complete.canvas.mpl_connect('button_press_event', self.select_node)
        fig_complete.canvas.mpl_connect('motion_notify_event', lambda event: self.move_node(event, fig_complete))
        fig_complete.canvas.mpl_connect('button_release_event', self.release_node)
        fig_complete.canvas.manager.full_screen_toggle()
        plt.show()

    def short_path_network(self, shortest_path):
        self.pos = nx.layout.planar_layout(self.G)
        path_edges = [(shortest_path[i], shortest_path[i + 1]) for i in range(len(shortest_path) - 1)]
        path_graph = self.G.edge_subgraph(path_edges)

        fig_short = plt.figure(figsize=(6, 6), facecolor="#F5EFE7")
        self.redraw(fig_short, path_graph)

        fig_short.canvas.mpl_connect('button_press_event', self.select_node)
        fig_short.canvas.mpl_connect('motion_notify_event', lambda event: self.move_node(event, fig_short, path_graph))
        fig_short.canvas.mpl_connect('button_release_event', self.release_node)
        fig_short.canvas.manager.full_screen_toggle()
        plt.show()

    def select_node(self, event):
        if event.inaxes is not None:
            x, y = event.xdata, event.ydata
            node = self.find_nearest_node(x, y)
            if node is not None:
                self.node_selected = node

    def move_node(self, event, fig, path_graph = None):
        if self.node_selected is not None:
            if event.inaxes is not None:
                x, y = event.xdata, event.ydata
                self.pos[self.node_selected] = (x, y)
                if path_graph:
                    self.redraw(fig, path_graph)
                else:
                    self.redraw(fig)

    def release_node(self, event):
        self.node_selected = None

    def find_nearest_node(self, x, y):
        min_dist = float('inf')
        nearest_node = None
        for node, pos in self.pos.items():
            dist = (pos[0] - x) ** 2 + (pos[1] - y) ** 2
            if dist < min_dist:
                min_dist = dist
                nearest_node = node
        return nearest_node

    def redraw(self, fig, path_graph=None):
        plt.clf()
        ax = fig.add_subplot(111)
       
        if path_graph is not None:
            nx.draw_networkx(self.G, self.pos, ax=ax, node_color=[self.node_colors.get(node, "#FFD95A") for node in self.G.nodes()],
                         edge_color="#C07F00")
            nx.draw_networkx_edges(path_graph, self.pos, edge_color="#4C3D3D", width=2, ax=ax)
            ax.set_title('Camino más corto')
            labels = nx.get_edge_attributes(self.G, 'weight')
            nx.draw_networkx_edge_labels(self.G, self.pos, edge_labels=labels, ax=ax)
            
        else:
            nx.draw_networkx(self.G, self.pos, ax=ax, node_color="#FFD95A", edge_color="#C07F00")
            ax.set_title('Grafo Normal')
            labels = nx.get_edge_attributes(self.G, 'weight')
            nx.draw_networkx_edge_labels(self.G, self.pos, edge_labels=labels, ax=ax)
        plt.draw()

       
if __name__ == '__main__':
    graph = GraphClass()

    for item in routes:
        graph.add_edge(item["origin"], item["destination"], item["time"])

    shortest_path = graph.dijkstra('HEL', 'HND')

    graph.complete_graph()
    graph.short_path_network(shortest_path)
     