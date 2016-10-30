from time import sleep


class LRect(object):
    def __init__(self, ai_settings, screen):
        super(LRect, self).__init__()
        self.ai_settings = ai_settings
        self.screen = screen
        self.screen_rect = screen.get_rect()
        self.centerx = self.screen_rect.centerx - self.ai_settings.rect_length * 2
        self.top = self.screen_rect.top

        self.figure = [[0, 1, 0], [0, 1, 0], [0, 1, 1]]
        self.figure2 = [[0, 1, 0], [0, 1, 0], [1, 1, 0]]

        self.current_figure = self.figure

    def udpate(self):
        if self.top < self.screen_rect.bottom - 20 * len(self.figure):
            self.top += 0.01
            # sleep(0.5)

    def transform(self):
        if self.current_figure == self.figure:
            self.current_figure = self.figure2
        else:
            self.current_figure = self.figure

    def draw_L_rect(self):
        for index_y, i in enumerate(self.current_figure):
            for index_x, j in enumerate(i):
                if j == 1:
                    draw_top = self.top + index_y * 20
                    draw_left = self.centerx + index_x * 20
                    # print str(draw_top) + ':' + str(draw_left)
                    self.ai_settings.draw_rect(
                        self.screen, draw_top, draw_left)
