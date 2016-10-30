import pygame
import sys


def check_event(ai_settings, screen, l_rect):
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            sys.exit()
        elif event.type == pygame.KEYDOWN:
            if event.key == pygame.K_SPACE:
                l_rect.transform()


def update_screen(ai_settings, screen, l_rect):
    screen.fill(ai_settings.bg_color)
    l_rect.draw_L_rect()

    pygame.display.flip()
