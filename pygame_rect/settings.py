import pygame


class Settings(object):
    def __init__(self):
        super(Settings, self).__init__()
        self.screen_width = 1200
        self.screen_height = 800
        self.bg_color = (230, 230, 230)
        self.rect_length = 20

    def draw_rect(self, screen, top, left):
        my_list = [left, top, self.rect_length, self.rect_length]
        pygame.draw.rect(screen, [255, 0, 0], my_list, 0)
