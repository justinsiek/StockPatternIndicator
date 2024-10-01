import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import mplfinance as mpf
from rw import check_top, check_bottom
from trendlines import fit_trendlines_single
from dataclasses import dataclass

@dataclass
class FlagPattern:
    base_x: int         # Start of the trend index, base of pole
    base_y: float       # Start of trend price

    tip_x: int   = -1       # Tip of pole, start of flag
    tip_y: float = -1.

    conf_x: int   = -1      # Index where pattern is confirmed
    conf_y: float = -1.      # Price where pattern is confirmed

    pennant: bool = False      # True if pennant, false if flag

    flag_width: int    = -1
    flag_height: float = -1.

    pole_width: int    = -1
    pole_height: float = -1.

    # Upper and lower lines for flag, intercept is tip_x
    support_intercept: float = -1.
    support_slope: float = -1.
    resist_intercept: float = -1.
    resist_slope: float = -1.

def check_flag(pending: FlagPattern, data: np.array, i:int):
    
    if data[pending.tip_x + 1 : i].min() < pending.tip_y: #check if a point in the flag is below the tip
       return False

    flag_max = data[pending.tip_x:i].max() #finds current maximum of the flag

    pole_height = pending.base_y - pending.tip_y #finds height of pole
    pole_width = pending.tip_x - pending.base_x #finds width of pole
    
    flag_height = flag_max - pending.tip_y #finds height of flag from current index
    flag_width = i - pending.tip_x #width of flag from current index
    
    if flag_width > pole_width * 0.5: # Flag should be less than half the width of pole
        return False

    if flag_height > pole_height * 0.75: # Flag should smaller vertically than preceding trend
        return False
    
    # Find trendlines going from flag tip to the previous bar (not including current bar)
    support_coefs, resist_coefs = fit_trendlines_single(data[pending.tip_x:i])
    support_slope, support_intercept = support_coefs[0], support_coefs[1]
    resist_slope, resist_intercept = resist_coefs[0], resist_coefs[1]

    # Check for breakout of lower trendline to confirm pattern
    current_support = support_intercept + support_slope * (flag_width + 1)
    if data[i] >= current_support:
        return False

    # Pattern is confiremd, fill out pattern details in pending
    if resist_slope < 0:
        pending.pennant = True
    else:
        pending.pennant = False

    pending.conf_x = i
    pending.conf_y = data[i]
    pending.flag_width = flag_width
    pending.flag_height = flag_height
    pending.pole_width = pole_width
    pending.pole_height = pole_height
    
    pending.support_slope = support_slope
    pending.support_intercept = support_intercept
    pending.resist_slope = resist_slope
    pending.resist_intercept = resist_intercept

    return True

def find_bear_flags(data: np.array, order:int):
    
    pending_flag = None #if we are in the middle of a pattern, this will store the pattern being analyzed
    last_bottom = -1 #stores index of last top
    last_top = -1 #stores index of last bottom


    bear_flags = [] #stores all the flags found, to be returned at the end of the function
 
    for i in range(len(data)):

        # Pattern data is organized like so:
        if check_bottom(data, i, order): #if a top is found at the current index
            last_bottom = i - order #sets last_top to the index of the top found
            if last_top != -1: #if there is also a last bottom
                pending = FlagPattern(last_top, data[last_top]) 
                '''sets base_x to the last bottom, which would be the
                beginning of the pattern, and sets base_y to the price at the last bottom, which would be the beginning price
                of the pattern. This works since all the other values in the FlagPattern dataclass have a default value'''
                pending.tip_x = last_bottom #sets start of the flag to the last top
                pending.tip_y = data[last_bottom]#sets start of the flag y value to last top value

                pending_flag = pending #sets pending flag to the flag created
        
        if check_top(data, i, order): #if bottom found at current index
            last_top = i - order #sets last_bottom to index of bottom found

        if pending_flag is not None: #if there is a pending flag
            if check_flag(pending_flag, data, i) and not pending_flag.pennant: #checks of flag is confirmed, and it is not a
                bear_flags.append(pending_flag.conf_x) #if so, flagpattern is added to bull_flags
                pending_flag = None #searches for a new pattern now

    return bear_flags