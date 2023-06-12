from matplotlib import pyplot as plt
import networkx as nx
import matplotlib.pyplot as plt

class GraphClass:
    def __init__(self):
        self.G = nx.Graph()
        self.pos = None
        self.figComplete = None
        self.figShort = None
        self.node_selected = None

    def add_edge(self, u, v, w):
        self.G.add_edge(u, v, weight=w)

    def dijkstra(self, origen, destino):
        shortest_path = nx.dijkstra_path(self.G, origen, destino)
        self.node_colors = {origen: "#FF8400", destino: "#FF8400"}
        return shortest_path

    def complete_graph(self):
        self.pos = nx.layout.planar_layout(self.G)

        self.figComplete = plt.figure(figsize=(6, 6), facecolor="#F5EFE7")
        self.redraw()
        
        self.figComplete.canvas.mpl_connect('button_press_event', self.select_node)
        self.figComplete.canvas.mpl_connect('motion_notify_event', self.move_nodeComplete)
        self.figComplete.canvas.mpl_connect('button_release_event', self.release_node)
        self.figComplete.canvas.manager.full_screen_toggle()  # Activa/desactiva el modo de pantalla completa para la figura 1

        plt.show()

    def short_path_network(self, shortest_path):
        self.pos = nx.layout.planar_layout(self.G)

        path_edges = [(shortest_path[i], shortest_path[i + 1]) for i in range(len(shortest_path) - 1)]
        self.path_graph = self.G.edge_subgraph(path_edges)

        self.figShort = plt.figure(figsize=(6, 6), facecolor="#F5EFE7")
        
        self.redrawShort()
        
        self.figShort.canvas.mpl_connect('button_press_event', self.select_node)
        self.figShort.canvas.mpl_connect('motion_notify_event', self.move_nodeShort)
        self.figShort.canvas.mpl_connect('button_release_event', self.release_node)
        self.figShort.canvas.manager.full_screen_toggle()  # Activa/desactiva el modo de pantalla completa para la figura 1
        plt.show()

    def select_node(self, event):
        if event.inaxes is not None:
            x, y = event.xdata, event.ydata
            node = self.find_nearest_node(x, y)
            if node is not None:
                self.node_selected = node
    
    #verificar si puede ser mas corto estos dos
    def move_nodeComplete(self, event):
        if self.node_selected is not None:
            if event.inaxes is not None:
                x, y = event.xdata, event.ydata
                self.pos[self.node_selected] = (x, y)
                self.redraw()

    def move_nodeShort(self, event):
        if self.node_selected is not None:
            if event.inaxes is not None:
                x, y = event.xdata, event.ydata
                self.pos[self.node_selected] = (x, y)
                self.redrawShort()
                    
    def release_node(self, event):
        self.node_selected = None

    def find_nearest_node(self, x, y):
        min_dist = float('inf')
        nearest_node = None
        for node, pos in self.pos.items():
            dist = (pos[0] - x) * 2 + (pos[1] - y) * 2
            if dist < min_dist:
                min_dist = dist
                nearest_node = node
        return nearest_node

    def redraw(self):
        plt.clf()
        self.axComplete = self.figComplete.add_subplot(111)
        nx.draw_networkx(self.G, self.pos, ax=self.axComplete, node_color="#FFD95A", edge_color="#C07F00")
        self.axComplete.set_title('Grafo Normal')
        self.labelscomplete = nx.get_edge_attributes(self.G, 'weight')
        nx.draw_networkx_edge_labels(self.G, self.pos, edge_labels=self.labelscomplete, ax=self.axComplete)

        plt.draw()

    def redrawShort (self):
        plt.clf()
        self.axShort= self.figShort.add_subplot(111)
        nx.draw_networkx(self.G, self.pos, ax=self.axShort, node_color=[self.node_colors.get(node, "#FFD95A") for node in self.G.nodes()],
                         edge_color="#C07F00")
        nx.draw_networkx_edges(self.path_graph, self.pos, edge_color="#4C3D3D", width=2, ax=self.axShort)
        self.labelShort = nx.get_edge_attributes(self.G, 'weight')
        nx.draw_networkx_edge_labels(self.G, self.pos, edge_labels=self.labelShort, ax=self.axShort)
        self.axShort.set_title('Camino más corto')

        plt.draw()
