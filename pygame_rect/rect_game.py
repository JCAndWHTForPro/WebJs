import pygame

from settings import Settings
from l_rect import LRect
import game_function as gf


def run_game():
    pygame.init()
    ai_settings = Settings()
    screen = pygame.display.set_mode(
        (ai_settings.screen_width, ai_settings.screen_height))

    l_rect = LRect(ai_settings, screen)
    pygame.display.set_caption("Rect")
    while True:
        gf.check_event(ai_settings, screen, l_rect)
        l_rect.udpate()
        gf.update_screen(ai_settings, screen, l_rect)

run_game()
