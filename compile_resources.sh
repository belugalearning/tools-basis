#!/bin/bash


targetFile=res.js
echo "" > $targetFile
resources=()

#images first
echo "Compiling Resources"
echo "  Collecting Images"
echo "// Images" >> $targetFile
i=0
for f in `find ./shared-resources -iname "*.png" -not \( -iname "*@2x.png" \)`
do
	strippedPath=`echo "$f" | sed "s/\.\//\//g"`
	varName=`echo "$strippedPath" | sed "s/\/shared\-resources\/images\///g" | sed "s/\//\_/g" | sed "s/\.png//" | sed "s/\-/\_/g" | awk '{print tolower($0)}'`
	echo "var $varName = \"$strippedPath\";" >> $targetFile
	resources[$i]="$varName"
	i=$((i+1))
done

echo "  Writing Resources"
echo "// Cocos Preloaded Resources" >> $targetFile
echo "var g_resources = [" >> $targetFile


last=$(( ${#resources[*]} - 1 ))
for r in "${!resources[@]}"
do
	if [[ $r == $last ]]
	then
		echo "    {src:${resources[$r]}}" >> $targetFile
	else 
		echo "    {src:${resources[$r]}}," >> $targetFile
	fi 
done
echo "];" >> $targetFile

echo "Resources Compiled!"
